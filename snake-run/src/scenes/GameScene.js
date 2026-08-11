import Phaser from 'phaser';

const LANE_COUNT = 5;
const SEGMENT_SPACING = 28;
const BODY_LENGTH = 8;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init() {
    this.score = 0;
    this.alive = true;
    this.scrollSpeed = 280;
    this.spawnTimer = 0;
    this.spawnInterval = 1100;
    this.targetLane = 2;
    this.laneX = [];
  }

  create() {
    const { width, height } = this.scale;

    const margin = width * 0.14;
    const usable = width - margin * 2;
    for (let i = 0; i < LANE_COUNT; i += 1) {
      this.laneX[i] = margin + (usable / (LANE_COUNT - 1)) * i;
    }

    this.bg = this.add.tileSprite(width / 2, height / 2, width, height, 'bg-tile');

    this.drawLaneGuides();

    this.obstacles = this.physics.add.group();

    const startY = height * 0.72;
    this.head = this.physics.add
      .image(this.laneX[this.targetLane], startY, 'snake-head')
      .setDepth(10);
    this.head.body.setCircle(Math.min(this.head.width, this.head.height) * 0.35);
    this.head.body.setOffset(
      this.head.width * 0.15,
      this.head.height * 0.15
    );
    this.head.body.allowGravity = false;

    this.bodyParts = [];
    for (let i = 0; i < BODY_LENGTH; i += 1) {
      const part = this.add
        .image(this.head.x, startY + (i + 1) * SEGMENT_SPACING, 'snake-body')
        .setDepth(9 - i * 0.01)
        .setScale(1 - i * 0.04);
      this.bodyParts.push(part);
    }

    this.trail = [];
    for (let i = 0; i < (BODY_LENGTH + 2) * 4; i += 1) {
      this.trail.push({ x: this.head.x, y: this.head.y + i * (SEGMENT_SPACING / 4) });
    }

    this.scoreText = this.add
      .text(24, 24, '0', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '36px',
        color: '#d4f5c4',
      })
      .setScrollFactor(0)
      .setDepth(20);

    this.hintText = this.add
      .text(width / 2, 32, 'Steer with ←→ / A D or mouse', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '16px',
        color: '#7a9e86',
      })
      .setOrigin(0.5, 0)
      .setDepth(20);

    this.time.delayedCall(2500, () => {
      if (this.hintText?.active) this.hintText.destroy();
    });

    this.input.keyboard.on('keydown-LEFT', () => this.nudgeLane(-1));
    this.input.keyboard.on('keydown-A', () => this.nudgeLane(-1));
    this.input.keyboard.on('keydown-RIGHT', () => this.nudgeLane(1));
    this.input.keyboard.on('keydown-D', () => this.nudgeLane(1));

    this.input.on('pointermove', (pointer) => {
      if (!this.alive) return;
      this.targetLane = this.laneFromX(pointer.worldX);
    });

    this.input.on('pointerdown', (pointer) => {
      if (!this.alive) return;
      this.targetLane = this.laneFromX(pointer.worldX);
    });

    this.physics.add.overlap(this.head, this.obstacles, () => this.crash());
  }

  drawLaneGuides() {
    const g = this.add.graphics().setAlpha(0.2);
    g.lineStyle(2, 0x6bcf7a, 1);
    const { height } = this.scale;
    this.laneX.forEach((x) => {
      g.lineBetween(x, 0, x, height);
    });
  }

  laneFromX(x) {
    let best = 0;
    let bestDist = Infinity;
    this.laneX.forEach((laneX, i) => {
      const d = Math.abs(laneX - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  nudgeLane(dir) {
    if (!this.alive) return;
    this.targetLane = Phaser.Math.Clamp(this.targetLane + dir, 0, LANE_COUNT - 1);
  }

  spawnObstacle() {
    const { height } = this.scale;
    const lane = Phaser.Math.Between(0, LANE_COUNT - 1);
    const obstacle = this.obstacles.create(this.laneX[lane], -40, 'obstacle');
    obstacle.setDepth(5);
    obstacle.body.allowGravity = false;
    obstacle.body.setSize(obstacle.width * 0.7, obstacle.height * 0.7);
    obstacle.setData('lane', lane);
  }

  update(_time, delta) {
    if (!this.alive) return;

    const dt = delta / 1000;
    this.scrollSpeed = Math.min(520, this.scrollSpeed + dt * 6);
    this.bg.tilePositionY -= this.scrollSpeed * dt * 0.4;

    const targetX = this.laneX[this.targetLane];
    this.head.x = Phaser.Math.Linear(this.head.x, targetX, 1 - Math.pow(0.001, dt));

    this.trail.unshift({ x: this.head.x, y: this.head.y });
    const maxTrail = (BODY_LENGTH + 2) * 4;
    if (this.trail.length > maxTrail) this.trail.length = maxTrail;

    this.bodyParts.forEach((part, i) => {
      const sample = this.trail[Math.min(this.trail.length - 1, (i + 1) * 4)];
      if (sample) {
        part.x = sample.x;
        part.y = sample.y + (i + 1) * 2;
      }
    });

    this.obstacles.getChildren().forEach((obs) => {
      obs.y += this.scrollSpeed * dt;
      if (obs.y > this.scale.height + 80) {
        obs.destroy();
      }
    });

    this.spawnTimer += delta;
    const interval = Math.max(550, this.spawnInterval - this.score * 2);
    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      this.spawnObstacle();
      if (Phaser.Math.FloatBetween(0, 1) > 0.65) {
        this.time.delayedCall(120, () => {
          if (this.alive) this.spawnObstacle();
        });
      }
    }

    this.score += dt * (this.scrollSpeed / 40);
    this.scoreText.setText(String(Math.floor(this.score)));
  }

  crash() {
    if (!this.alive) return;
    this.alive = false;

    const burst = this.add.particles(this.head.x, this.head.y, 'particle', {
      speed: { min: 80, max: 220 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 18,
      emitting: false,
    });
    burst.explode(18);

    this.cameras.main.shake(200, 0.01);
    this.time.delayedCall(450, () => {
      this.scene.start('GameOverScene', { score: Math.floor(this.score) });
    });
  }
}
