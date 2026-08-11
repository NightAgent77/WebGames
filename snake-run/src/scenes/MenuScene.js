import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.tileSprite(width / 2, height / 2, width, height, 'bg-tile').setAlpha(0.35);

    this.add
      .text(width / 2, height * 0.28, 'SNAKE RUN', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '72px',
        color: '#d4f5c4',
        stroke: '#1a3d28',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.38, 'Steer clear. Stay alive.', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '24px',
        color: '#8fb89a',
      })
      .setOrigin(0.5);

    const startBtn = this.add
      .text(width / 2, height * 0.55, 'START', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '40px',
        color: '#0b1210',
        backgroundColor: '#6bcf7a',
        padding: { x: 36, y: 14 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => startBtn.setStyle({ backgroundColor: '#8ee09a' }));
    startBtn.on('pointerout', () => startBtn.setStyle({ backgroundColor: '#6bcf7a' }));
    startBtn.on('pointerdown', () => this.startGame());

    this.add
      .text(
        width / 2,
        height * 0.72,
        'Keyboard: ← → or A D to steer · Space to start\nMouse: move to steer · click Start',
        {
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '18px',
          color: '#7a9e86',
          align: 'center',
          lineSpacing: 8,
        }
      )
      .setOrigin(0.5);

    this.input.keyboard?.once('keydown-SPACE', () => this.startGame());
    this.input.keyboard?.once('keydown-ENTER', () => this.startGame());
  }

  startGame() {
    this.scene.start('GameScene');
  }
}
