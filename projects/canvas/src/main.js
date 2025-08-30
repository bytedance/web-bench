// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { updateStore, activateShield, changeWeather, generateField, spawnEnemy, spawnBoss, updateCoinPhase } from './store.js';
import { resizeCanvas, initializeWeatherParticles, updateWeatherParticles, updateEnemies, checkEnemyCollision, createInvertedBirdImage, updateBullets, updateBoss, updateBossBullets } from './util.js';
import { drawScore, drawBird, drawFloor, drawPipes, updatePipes, drawStartText, drawGameOver, drawLives, drawWeather, drawField, drawEnemies, drawBullets, drawBoss, drawBossBullets, drawBombs, drawBombExplosion, drawCoinPhase } from './render.js';
import { startAnimation, jump, loseLife, endGame, restartGame, fireBullet, useBomb } from './event.js';
import { GRAVITY, MAX_VELOCITY, ITEM_SIZE, WEATHER_CHANGE_INTERVAL, COIN_SCORE, RAIN_JUMP_MULTIPLIER, RAIN_FALL_MULTIPLIER, FIELD_GENERATION_INTERVAL, PIPE_SPEED, ENEMY_SPAWN_INTERVAL, BOSS_SPAWN_INTERVAL, BOMB_ANIMATION_DURATION } from './constants.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function updateBird() {
    if (window.store.isAnimating) {
        let { velocity, y, rotation, x } = window.store.bird;
        let gravityMultiplier = window.store.weather.current === 'Rain' ? RAIN_FALL_MULTIPLIER : 1;

        if (window.store.coinPhase.isActive) {
            const canvas = document.getElementById('myCanvas');
            const maxX = canvas.width / window.store.dpr - window.store.assets.birdImg.width;
            
            // Use a single horizontal movement value
            x += window.store.horizontalMovement * 5;
            x = Math.max(0, Math.min(maxX, x));
            
            // Vertical movement logic
            if (window.store.rapidDescent) {
                velocity = 6;
            } else {
                velocity += GRAVITY * window.store.frameAdjustedRate * gravityMultiplier;
                velocity = Math.min(velocity, MAX_VELOCITY);
            }
            
            y += velocity * window.store.frameAdjustedRate;
            
            const minY = 0;
            const maxY = canvas.height / window.store.dpr - window.store.floorHeight - window.store.assets.birdImg.height;
            y = Math.max(minY, Math.min(maxY, y));
            
            updateStore({ bird: { ...window.store.bird, velocity, y, rotation, x } });
            return
        }

        if (window.store.rapidDescent) {
            velocity = 6;
        } else {
            velocity += GRAVITY * window.store.frameAdjustedRate * gravityMultiplier;
            velocity = Math.min(velocity, MAX_VELOCITY);
        }

        if (window.store.field && 
            window.store.bird.x >= window.store.field.x && 
            window.store.bird.x <= window.store.field.x + window.store.field.width) {
            velocity = Math.min(velocity, 0);
        }
        y += velocity * window.store.frameAdjustedRate;
        const targetRotation = velocity > 0 ? 35 : -35;
        rotation += (targetRotation - rotation) * 0.2 * window.store.frameAdjustedRate;

        if (y + window.store.assets.birdImg.height >= canvas.height / window.store.dpr - window.store.floorHeight) {
            if (window.store.mode !== 'debug' && !window.store.isProtected) {
                loseLife();
            } else {
                y = canvas.height / window.store.dpr - window.store.floorHeight - window.store.assets.birdImg.height;
            }
        }

        updateStore({ bird: { ...window.store.bird, velocity, y, rotation } });

        window.store.pipes.forEach(pipe => {
            if (
                window.store.bird.x + window.store.assets.birdImg.width > pipe.x &&
                window.store.bird.x < pipe.x + pipe.width &&
                (window.store.bird.y < pipe.topHeight || window.store.bird.y + window.store.assets.birdImg.height > pipe.bottomY)
            ) {
                if (window.store.mode !== 'debug' && !window.store.isProtected) {
                    loseLife();
                }
            }

            if (pipe.item && !pipe.item.collected) {
                const birdCenterX = window.store.bird.x + window.store.assets.birdImg.width / 2;
                const birdCenterY = window.store.bird.y + window.store.assets.birdImg.height / 2;
                const itemCenterX = pipe.item.x + ITEM_SIZE / 2;
                const itemCenterY = pipe.item.y + ITEM_SIZE / 2;

                const distance = Math.sqrt(
                    Math.pow(birdCenterX - itemCenterX, 2) + Math.pow(birdCenterY - itemCenterY, 2)
                );

                if (distance < (window.store.assets.birdImg.width / 2 + ITEM_SIZE / 2)) {
                    pipe.item.collected = true;
                    if (pipe.item.type === 'Shield') {
                        activateShield();
                    } else if (pipe.item.type === 'Heart') {
                        updateStore({ lives: Math.min(window.store.lives + 1, window.store.maxLives) });
                    } else if (pipe.item.type === 'Coin') {
                        updateStore({ score: window.store.score + COIN_SCORE });
                    } else if (pipe.item.type === 'Bomb') {
                        updateStore({ bombs: Math.min(window.store.bombs + 1, window.store.maxBombs) });
                    }
                }
            }
        });

        if (checkEnemyCollision() && window.store.mode !== 'debug' &&!window.store.isProtected) {
            loseLife();
        }
    }
}

function updateField() {
    if (window.store.field && window.store.isAnimating) {
        const updatedX = window.store.field.x - PIPE_SPEED * window.store.frameAdjustedRate * (window.store.speedUp ? 2 : 1);
        if (updatedX + window.store.field.width < 0) {
            updateStore({ field: null });
        } else {
            updateStore({
                field: {
                    ...window.store.field,
                    x: updatedX
                }
            });
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (window.store.coinPhase.isActive) {
        drawCoinPhase(ctx, canvas);
        updateCoinPhase(canvas);
        drawBird(ctx);
        updateBird();
    } else {
        drawWeather(ctx, canvas);
        drawPipes(ctx);
        drawEnemies(ctx);
        drawBullets(ctx);
        drawBoss(ctx);
        drawBossBullets(ctx);
        drawScore(ctx);
        drawLives(ctx, canvas);
        drawBombs(ctx, canvas);
        drawBird(ctx);
        drawFloor(ctx, canvas);
        drawStartText(ctx, canvas);
        drawGameOver(ctx, canvas);
        if (window.store.field) {
            drawField(ctx);
        }
        if (window.store.isExploding) {
            drawBombExplosion(ctx, canvas);
        }
        updatePipes(canvas);
        updateBird();
        updateField();
        updateWeatherParticles(canvas);
        updateEnemies(canvas);
        updateBullets(canvas);
        updateBoss(canvas);
        updateBossBullets(canvas);
    }
    requestAnimationFrame(render);
}

window.addEventListener('resize', () => {
    updateStore({ dpr: window.devicePixelRatio || 1 });
    resizeCanvas(canvas, ctx);
    initializeWeatherParticles();
});

canvas.addEventListener('click', () => {
    if (!window.store.isGameOver) {
        startAnimation();
        jump();
    }
});

window.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === 'w' || e.key === 'j' || e.key === ' ' || e.key === 'ArrowUp') && !window.store.isGameOver) {
        startAnimation();
        jump();
    }
    if (e.key === 'ArrowDown' || e.key === 's') {
        updateStore({ rapidDescent: true });
    }
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        updateStore({ horizontalMovement: -1 });
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        updateStore({ speedUp: true });
        updateStore({ horizontalMovement: 1 });
    }
    if (e.key === 'k') {
        fireBullet();
    }
    if (e.key === 'b') {
        useBomb();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown' || e.key === 's') {
        updateStore({ rapidDescent: false });
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        updateStore({ speedUp: false });
    }
    if ((e.key === 'ArrowLeft' || e.key === 'a') && window.store.horizontalMovement === -1) {
        updateStore({ horizontalMovement: 0 });
    }
    if ((e.key === 'ArrowRight' || e.key === 'd') && window.store.horizontalMovement === 1) {
        updateStore({ horizontalMovement: 0 });
    }
});

Promise.all([
    new Promise(resolve => window.store.assets.birdImg.onload = ()=>{
        createInvertedBirdImage(window.store.assets.birdImg).then(img => window.store.assets.enemyImg = img).then(()=>{;
            resolve();
        });
    }),
    new Promise(resolve => window.store.assets.floorImg.onload = resolve),
    new Promise(resolve => window.store.assets.pipeUpImg.onload = resolve),
    new Promise(resolve => window.store.assets.pipeDownImg.onload = resolve)
]).then(() => {
    resizeCanvas(canvas, ctx);
    initializeWeatherParticles();
    render();
    setInterval(() => changeWeather(), WEATHER_CHANGE_INTERVAL);
    setInterval(() => generateField(canvas), FIELD_GENERATION_INTERVAL);
    setInterval(() => spawnEnemy(canvas), ENEMY_SPAWN_INTERVAL);
    setInterval(() => spawnBoss(canvas), BOSS_SPAWN_INTERVAL);
});