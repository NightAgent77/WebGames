import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.38, 'SNAKE RUN', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '56px',
        color: '#d4f5c4',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.46, 'Loading…', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '22px',
        color: '#8fb89a',
      })
      .setOrigin(0.5);

    const barWidth = Math.min(420, width * 0.7);
    const barHeight = 22;
    const barX = width / 2 - barWidth / 2;
    const barY = height * 0.55;

    const track = this.add.graphics();
    track.fillStyle(0x1a2a22, 1);
    track.fillRoundedRect(barX, barY, barWidth, barHeight, 8);
    track.lineStyle(2, 0x3d6b4f, 1);
    track.strokeRoundedRect(barX, barY, barWidth, barHeight, 8);

    const fill = this.add.graphics();
    const percentText = this.add
      .text(width / 2, barY + barHeight + 28, '0%', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '18px',
        color: '#b8dcc4',
      })
      .setOrigin(0.5);

    this.load.on('progress', (value) => {
      fill.clear();
      fill.fillStyle(0x6bcf7a, 1);
      const inset = 3;
      const w = Math.max(0, (barWidth - inset * 2) * value);
      fill.fillRoundedRect(barX + inset, barY + inset, w, barHeight - inset * 2, 6);
      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    // Relative paths only — works when hosted in a subfolder
    this.load.image('snake-head', './assets/images/snake-head.png');
    this.load.image('snake-body', './assets/images/snake-body.png');
    this.load.image('obstacle', './assets/images/obstacle.png');
    this.load.image('particle', './assets/images/particle.png');
    this.load.image('bg-tile', './assets/images/bg-tile.png');
  }

  create() {
    this.scene.start('MenuScene');
  }
}
