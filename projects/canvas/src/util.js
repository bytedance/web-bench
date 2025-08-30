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

import { PIPE_GAP_MIN, PIPE_GAP_MAX, PIPE_TOP_MIN, ITEM_SIZE, PARTICLE_COUNT, RAIN_BASE_LENGTH, RAIN_BASE_SPEED, RAIN_ANGLE, WIND_MIN_LENGTH, WIND_MAX_LENGTH, WIND_MIN_SPEED, WIND_MAX_SPEED, ENEMY_SPEED, BULLET_SPEED, BOSS_SIZE, BULLET_FIRING_INTERVAL, BULLET_SIZE } from './constants.js';
import { updateStore, enterCoinPhase } from './store.js'
import { loseLife } from './event.js'

export function generatePipe(canvasWidth, canvasHeight) {
    const gap = Math.random() * (PIPE_GAP_MAX - PIPE_GAP_MIN) + PIPE_GAP_MIN;
    const maxTopHeight = canvasHeight / (2 * window.store.dpr) - 80;
    const topHeight = Math.random() * (maxTopHeight - PIPE_TOP_MIN) + PIPE_TOP_MIN;
    const bottomY = topHeight + gap;

    let item = null;
    if (Math.random() < window.store.randomRate) {
        const itemTypes = window.store.weather.current === 'Night' ? ['Shield', 'Heart', 'Coin', 'Bomb'] : ['Shield', 'Heart'];
        const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        item = {
            x: canvasWidth / window.store.dpr + window.store.assets.pipeUpImg.width / 2 - ITEM_SIZE / 2,
            y: topHeight + gap / 2 - ITEM_SIZE / 2,
            type: itemType,
            collected: false
        };
    }

    return {
        x: canvasWidth / window.store.dpr,
        topHeight,
        bottomY,
        width: window.store.assets.pipeUpImg.width,
        passed: false,
        item
    };
}

export function resizeCanvas(canvas, ctx) {
    const { innerWidth: width, innerHeight: height } = window;
    const ratio = 600 / 800;
    canvas.width = Math.min(width, height * ratio);
    canvas.height = height;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    canvas.width *= window.store.dpr;
    canvas.height *= window.store.dpr;
    ctx.scale(window.store.dpr, window.store.dpr);
    return updateStore({
        bird: {
            ...window.store.bird,
            y: canvas.height / (2 * window.store.dpr) - window.store.assets.birdImg.height / 2
        }
    });
}

export function initializeWeatherParticles() {
    const canvas = document.getElementById('myCanvas');
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createWeatherParticle(canvas));
    }

    updateStore({
        weather: {
            ...window.store.weather,
            particles
        }
    });
}

function createWeatherParticle(canvas) {
    const { current } = window.store.weather;
    const x = Math.random() * canvas.width / window.store.dpr;
    const y = Math.random() * canvas.height / window.store.dpr;

    switch (current) {
        case 'Rain':
            return {
                x,
                y,
                length: RAIN_BASE_LENGTH + Math.random() * 10,
                speed: RAIN_BASE_SPEED + Math.random() * 10
            };
        case 'Wind':
            return {
                x,
                y,
                length: WIND_MIN_LENGTH + Math.random() * (WIND_MAX_LENGTH - WIND_MIN_LENGTH),
                speed: WIND_MIN_SPEED + Math.random() * (WIND_MAX_SPEED - WIND_MIN_SPEED)
            };
        case 'Night':
            return {
                x,
                y,
                size: Math.random() * 2,
                opacity: Math.random()
            };
        default:
            return { x, y };
    }
}

export function updateWeatherParticles(canvas) {
    const { current, particles } = window.store.weather;

    const updatedParticles = particles.map(particle => {
        switch (current) {
            case 'Rain':
                particle.y += particle.speed * window.store.frameAdjustedRate;
                particle.x += particle.speed * Math.sin(RAIN_ANGLE * Math.PI / 180) * window.store.frameAdjustedRate;
                if (particle.y > canvas.height / window.store.dpr) {
                    particle.y = 0;
                    particle.x = Math.random() * canvas.width / window.store.dpr;
                }
                break;
            case 'Wind':
                particle.x += particle.speed * window.store.frameAdjustedRate;
                if (particle.x > canvas.width / window.store.dpr) {
                    particle.x = 0;
                    particle.y = Math.random() * canvas.height / window.store.dpr;
                    particle.length = WIND_MIN_LENGTH + Math.random() * (WIND_MAX_LENGTH - WIND_MIN_LENGTH);
                    particle.speed = WIND_MIN_SPEED + Math.random() * (WIND_MAX_SPEED - WIND_MIN_SPEED);
                }
                break;
            case 'Night':
                particle.opacity = Math.sin(Date.now() / 1000 + particle.x) * 0.5 + 0.5;
                break;
        }
        return particle;
    });

    updateStore({
        weather: {
            ...window.store.weather,
            particles: updatedParticles
        }
    });
}

export async function createInvertedBirdImage(birdImg) {
    const offscreenCanvas = document.createElement('canvas');
    const ctx = offscreenCanvas.getContext('2d');

    // Set canvas size to match bird image
    offscreenCanvas.width = birdImg.width;
    offscreenCanvas.height = birdImg.height;

    // Draw and transform bird image
    ctx.translate(offscreenCanvas.width, 0);
    ctx.scale(-1, 1); // Mirror horizontally
    ctx.drawImage(birdImg, 0, 0);

    // Invert colors
    const imageData = ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // Invert red
        data[i + 1] = 255 - data[i + 1]; // Invert green
        data[i + 2] = 255 - data[i + 2]; // Invert blue
    }
    ctx.putImageData(imageData, 0, 0);

    // Create new image from canvas
    const img = new Image();
    img.src = offscreenCanvas.toDataURL();
    await new Promise(resolve => img.onload = resolve);
    return img;
}

export function updateEnemies(canvas) {
    const updatedEnemies = window.store.enemies.map(enemy => ({
        ...enemy,
        x: enemy.x - ENEMY_SPEED * window.store.frameAdjustedRate,
        y: enemy.y + enemy.verticalVelocity * window.store.frameAdjustedRate
    })).filter(enemy => enemy.x + window.store.assets.birdImg.width > 0);

    updateStore({ enemies: updatedEnemies });
}

export function checkEnemyCollision() {
    const bird = window.store.bird;
    for (let enemy of window.store.enemies) {
        if (
            bird.x < enemy.x + window.store.assets.birdImg.width &&
            bird.x + window.store.assets.birdImg.width > enemy.x &&
            bird.y < enemy.y + window.store.assets.birdImg.height &&
            bird.y + window.store.assets.birdImg.height > enemy.y
        ) {
            return true;
        }
    }
    return false;
}

/**
 * Check if two rectangles overlap
 */
export const checkRectCollision = (rect1, rect2) => {
    return rect1.right > rect2.left &&
        rect1.left < rect2.right &&
        rect1.bottom > rect2.top &&
        rect1.top < rect2.bottom;
};

// Add bullet update function
export const updateBullets = (canvas) => {
    const updatedBullets = window.store.bullets
        .map(bullet => ({
            ...bullet,
            x: bullet.x + BULLET_SPEED
        }))
        .filter(bullet => bullet.x < canvas.clientWidth); // Remove off-screen bullets

    // Check for collisions with enemies
    const remainingEnemies = [...window.store.enemies];
    const survivingBullets = updatedBullets.filter(bullet => {
        const bulletHitbox = {
            left: bullet.x,
            right: bullet.x + bullet.width,
            top: bullet.y,
            bottom: bullet.y + bullet.height
        };

        // Check each enemy for collision
        const hitEnemy = remainingEnemies.findIndex(enemy => {
            const enemyHitbox = {
                left: enemy.x,
                right: enemy.x + window.store.assets.enemyImg.width,
                top: enemy.y,
                bottom: enemy.y + window.store.assets.enemyImg.height
            };
            return checkRectCollision(bulletHitbox, enemyHitbox);
        });

        if (hitEnemy !== -1) {
            // Remove the hit enemy
            remainingEnemies.splice(hitEnemy, 1);
            return false; // Remove the bullet
        }
        return true; // Keep the bullet
    });

    updateStore({
        bullets: survivingBullets,
        enemies: remainingEnemies
    });
};
// Add Boss update function
export function updateBoss(canvas) {
    if (!window.store.boss) return;

    const boss = window.store.boss;
    const maxY = canvas.height / window.store.dpr - window.store.floorHeight - BOSS_SIZE;
    let newY = boss.y + boss.verticalVelocity * window.store.frameAdjustedRate;

    // Boundary detection and reversal
    if (newY <= 0 || newY >= maxY) {
        boss.verticalVelocity *= -1;
        newY = Math.max(0, Math.min(maxY, newY));
    }

    updateStore({
        boss: {
            ...boss,
            y: newY
        }
    });

    // Check bullet collision
    const remainingBullets = window.store.bullets.filter(bullet => {
        const bulletHitbox = {
            left: bullet.x,
            right: bullet.x + bullet.width,
            top: bullet.y,
            bottom: bullet.y + bullet.height
        };

        const bossHitbox = {
            left: boss.x,
            right: boss.x + BOSS_SIZE,
            top: boss.y,
            bottom: boss.y + BOSS_SIZE
        };

        if (checkRectCollision(bulletHitbox, bossHitbox)) {
            // Hit Boss
            const newLives = boss.lives - 1;
            if (newLives <= 0) {
                // Boss defeated, set new spawn time
                updateStore({
                    boss: null,
                    bossSpawnTime: Date.now()
                });
                enterCoinPhase(canvas);
            } else {
                updateStore({
                    boss: {
                        ...boss,
                        lives: newLives
                    }
                });
            }
            // Remove bullet
            return false;
        }
        return true;
    });

    updateStore({ bullets: remainingBullets });
}

// Add Boss bullet update function
export function updateBossBullets(canvas) {
    if (!window.store.boss) return;

    // Generate new bullets
    const currentTime = Date.now();
    if (currentTime - window.store.lastBossBulletFiredTime >= BULLET_FIRING_INTERVAL) {
        const newBullet = {
            x: window.store.boss.x,
            y: window.store.boss.y + BOSS_SIZE / 2 - BULLET_SIZE / 2,
            width: BULLET_SIZE,
            height: BULLET_SIZE,
            speed: -BULLET_SPEED // Move left
        };

        updateStore({
            bossBullets: [...window.store.bossBullets, newBullet],
            lastBossBulletFiredTime: currentTime
        });
    }

    // Update bullet positions and check collisions
    const updatedBullets = window.store.bossBullets
        .map(bullet => ({
            ...bullet,
            x: bullet.x + bullet.speed
        }))
        .filter(bullet => bullet.x + bullet.width > 0);

    // Check collision with player
    const bulletHitPlayer = updatedBullets.some(bullet => {
        const bulletHitbox = {
            left: bullet.x,
            right: bullet.x + bullet.width,
            top: bullet.y,
            bottom: bullet.y + bullet.height
        };

        const birdHitbox = {
            left: window.store.bird.x,
            right: window.store.bird.x + window.store.assets.birdImg.width,
            top: window.store.bird.y,
            bottom: window.store.bird.y + window.store.assets.birdImg.height
        };

        return checkRectCollision(bulletHitbox, birdHitbox);
    });

    if (bulletHitPlayer && !window.store.isProtected && window.store.mode !== 'debug') {
        loseLife();
    }

    updateStore({ bossBullets: updatedBullets });
}