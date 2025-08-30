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

import { FLOOR_HEIGHT, BIRD_INITIAL_X, SHIELD_DURATION, MAX_LIVES, WEATHER_TYPES, FIELD_HEIGHT, PIPE_SPAWN_DISTANCE, MAX_ENEMIES, ENEMY_VERTICAL_VELOCITY_RANGE, BOSS_SIZE, BOSS_LIVES, BOSS_VERTICAL_VELOCITY_RANGE, MAX_BOMBS, ITEM_SIZE, COIN_SCORE  } from './constants.js';
import { initializeWeatherParticles } from './util.js'

const urlParams = new URLSearchParams(window.location.search);

window.store = {
    score: 0,
    floorX: 0,
    frameAdjustedRate: parseFloat(urlParams.get('frameAdjustedRate')) || 1,
    isAnimating: false,
    isGameOver: false,
    bird: { x: BIRD_INITIAL_X, y: 0, velocity: 0, rotation: 0 },
    pipes: [],
    enemies: [],
    bullets: [],
    floorHeight: FLOOR_HEIGHT,
    mode: urlParams.get('mode') || 'normal',
    dpr: window.devicePixelRatio || 1,
    assets: {
        birdImg: new Image(),
        floorImg: new Image(),
        pipeUpImg: new Image(),
        pipeDownImg: new Image(),
        enemyImg: null
    },
    randomRate: 0.25,
    fieldRandomRate: 0.25,
    isProtected: false,
    shieldEndTime: 0,
    lives: 1,
    maxLives: MAX_LIVES,
    weather: {
        current: 'Normal',
        particles: []
    },
    field: null,
    rapidDescent: false,
    speedUp: false,
    lastBulletFiredTime: 0,
    boss: null,
    bossBullets: [],
    lastBossBulletFiredTime: 0,
    bossSpawnTime: 0,
    bombs: 3,
    isExploding: false,
    explodProgress: 0,
    maxBombs: MAX_BOMBS,
    coinPhase: {
        isActive: false,
        startTime: 0,
        coins: [],
        lastPhaseEndTime: 0
    },
    horizontalMovement: 0,
};

window.store.assets.birdImg.src = 'assets/bird.png';
window.store.assets.floorImg.src = 'assets/fg.png';
window.store.assets.pipeUpImg.src = 'assets/pipeUp.png';
window.store.assets.pipeDownImg.src = 'assets/pipeDown.png';

export function updateStore(newState) {
    window.store = { ...window.store, ...newState };
    return window.store;
}

export function activateShield(duration = SHIELD_DURATION) {
    const currentTime = Date.now();
    updateStore({
        isProtected: true,
        shieldEndTime: currentTime + duration
    });
}

export function changeWeather() {
    if (!window.store.isAnimating || window.store.isGameOver) {
        return
    }
    const currentWeather = window.store.weather.current;
    const availableWeathers = WEATHER_TYPES.filter(w => w !== currentWeather);
    const newWeather = availableWeathers[Math.floor(Math.random() * availableWeathers.length)];
    
    if (newWeather !== 'Night') {
        const updatedPipes = window.store.pipes.map(pipe => ({
            ...pipe,
            item: pipe.item && pipe.item.type !== 'Coin' ? pipe.item : null
        }));
        updateStore({ pipes: updatedPipes });
    }
    
    updateStore({
        weather: {
            ...window.store.weather,
            current: newWeather
        }
    });

    initializeWeatherParticles()
}

export function generateField(canvas) {
    if (!window.store.isAnimating || window.store.isGameOver) {
        return
    }
    if (Math.random() < window.store.fieldRandomRate) {
        const width = PIPE_SPAWN_DISTANCE * 3;
        const x = canvas.width / window.store.dpr;
        const y = canvas.height / window.store.dpr - window.store.floorHeight;
        updateStore({
            field: {
                x,
                y,
                width,
                height: FIELD_HEIGHT,
                type: 'Zero'
            }
        });
    } else {
        updateStore({ field: null });
    }
}

export function spawnEnemy(canvas) {
    if (!window.store.isAnimating || window.store.isGameOver) {
        return
    }
    if (window.store.enemies.length < MAX_ENEMIES) {
        const enemy = {
            x: canvas.width / window.store.dpr,
            y: Math.random() * (canvas.height / window.store.dpr - window.store.floorHeight - window.store.assets.birdImg.height),
            verticalVelocity: (Math.random() - 0.5) * ENEMY_VERTICAL_VELOCITY_RANGE
        };
        updateStore({ enemies: [...window.store.enemies, enemy] });
    }
}

export function spawnBoss(canvas) {
    if (!window.store.isAnimating || window.store.isGameOver) {
        return
    }
    const currentTime = Date.now();
    const timeSinceLastBoss = currentTime - window.store.bossSpawnTime;
    
    // Check if a new Boss should be generated (after 10 seconds)
    if (!window.store.boss && timeSinceLastBoss >= 10000) {
        const boss = {
            x: canvas.width / window.store.dpr - BOSS_SIZE,
            y: (canvas.height / window.store.dpr - window.store.floorHeight - BOSS_SIZE) / 2,
            lives: BOSS_LIVES,
            verticalVelocity: BOSS_VERTICAL_VELOCITY_RANGE
        };
        updateStore({ 
            boss: boss,
            lastBossBulletFiredTime: currentTime
        });
    }
}

export function enterCoinPhase(canvas) {
    const coins = generateCoinField(canvas);
    const currentTime = Date.now();

    // Store original bird x position before entering coin phase
    const originalX = window.store.bird.x;
    updateStore({
        coinPhase: {
            isActive: true,
            startTime: currentTime,
            coins: coins,
            lastPhaseEndTime: currentTime + 5000, // 5 seconds duration
            originalBirdX: originalX 
        },
        pipes: [],
        enemies: [],
        boss: null,
        bossBullets: []
    });

    // Reset bird position to bottom middle
    const birdY = canvas.height / window.store.dpr - window.store.floorHeight - window.store.assets.birdImg.height;
    const birdX = (canvas.width / window.store.dpr - window.store.assets.birdImg.width) / 2;
    
    updateStore({
        bird: {
            ...window.store.bird,
            x: birdX,
            y: birdY,
            velocity: 0
        }
    });
}

function generateCoinField(canvas) {
    const coins = [];
    const coinSize = ITEM_SIZE;
    const spacing = 60;
    const columns = Math.floor((canvas.width / window.store.dpr) / spacing);
    const rows = Math.floor((canvas.height / window.store.dpr) / spacing);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (Math.random() < 0.7) { // 70% chance to spawn a coin
                coins.push({
                    x: col * spacing + (spacing - coinSize) / 2,
                    y: -row * spacing, // Start above canvas
                    collected: false,
                    size: coinSize
                });
            }
        }
    }
    
    return coins;
}

export function updateCoinPhase(canvas) {
    if (!window.store.coinPhase.isActive) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - window.store.coinPhase.startTime;

    // Check if coin phase should end
    if (elapsedTime >= 5000) {
        exitCoinPhase();
        return;
    }

    // Update coin positions
    const scrollSpeed = 2;
    const updatedCoins = window.store.coinPhase.coins.map(coin => ({
        ...coin,
        y: coin.y + scrollSpeed
    })).filter(coin => !coin.collected && coin.y < canvas.height / window.store.dpr);

    // Check coin collection
    updatedCoins.forEach(coin => {
        if (!coin.collected && checkCoinCollision(coin, window.store.bird)) {
            coin.collected = true;
            updateStore({ score: window.store.score + COIN_SCORE });
        }
    });

    updateStore({
        coinPhase: {
            ...window.store.coinPhase,
            coins: updatedCoins
        }
    });
}

function checkCoinCollision(coin, bird) {
    const birdCenterX = bird.x + window.store.assets.birdImg.width / 2;
    const birdCenterY = bird.y + window.store.assets.birdImg.height / 2;
    const coinCenterX = coin.x + coin.size / 2;
    const coinCenterY = coin.y + coin.size / 2;

    const distance = Math.sqrt(
        Math.pow(birdCenterX - coinCenterX, 2) + 
        Math.pow(birdCenterY - coinCenterY, 2)
    );

    return distance < (window.store.assets.birdImg.width / 2 + coin.size / 2);
}

function exitCoinPhase() {
    const originalX = window.store.coinPhase.originalBirdX || BIRD_INITIAL_X;
    
    updateStore({
        coinPhase: {
            ...window.store.coinPhase,
            isActive: false,
            coins: [],
            lastPhaseEndTime: Date.now()
        },
        bird: {
            ...window.store.bird,
            x: originalX // Restore original x position
        }
    });
    
    // Activate shield for 3 seconds
    activateShield(3000);
}