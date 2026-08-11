import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data?.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;

    this.add.tileSprite(width / 2, height / 2, width, height, 'bg-tile').setAlpha(0.25);

    this.add
      .text(width / 2, height * 0.28, 'GAME OVER', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '64px',
        color: '#f0a8a0',
        stroke: '#3d1a1a',
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.4, `Score: ${this.finalScore}`, {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '36px',
        color: '#d4f5c4',
      })
      .setOrigin(0.5);

    const retryBtn = this.add
      .text(width / 2, height * 0.55, 'RUN AGAIN', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '36px',
        color: '#0b1210',
        backgroundColor: '#6bcf7a',
        padding: { x: 28, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    retryBtn.on('pointerover', () => retryBtn.setStyle({ backgroundColor: '#8ee09a' }));
    retryBtn.on('pointerout', () => retryBtn.setStyle({ backgroundColor: '#6bcf7a' }));
    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const menuBtn = this.add
      .text(width / 2, height * 0.66, 'MENU', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '28px',
        color: '#b8dcc4',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setColor('#ffffff'));
    menuBtn.on('pointerout', () => menuBtn.setColor('#b8dcc4'));
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));

    this.add
      .text(width / 2, height * 0.8, 'Space / Enter to retry · Esc for menu', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '16px',
        color: '#7a9e86',
      })
      .setOrigin(0.5);

    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('GameScene'));
    this.input.keyboard?.once('keydown-ESC', () => this.scene.start('MenuScene'));
  }
}
