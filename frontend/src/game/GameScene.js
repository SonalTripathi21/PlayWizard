import Phaser from 'phaser';

// A factory function that returns a Phaser Scene class configured by the AI JSON
// A factory function that returns a Phaser Scene class configured by the AI JSON
export default function createGameScene(gameConfig) {
  return class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
    }

    preload() {
      this.createGraphics();
    }

    drawShape(graphics, shape, color) {
      graphics.clear();
      graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
      
      switch (shape) {
        case 'circle':
          graphics.fillCircle(15, 15, 15);
          break;
        case 'triangle':
          graphics.fillTriangle(15, 0, 0, 30, 30, 30);
          break;
        case 'star':
          graphics.fillTriangle(15, 0, 0, 25, 30, 25);
          graphics.fillTriangle(15, 30, 0, 5, 30, 5);
          break;
        case 'pipe':
          graphics.fillRect(5, 5, 20, 25);
          graphics.fillRect(0, 0, 30, 10);
          break;
        case 'ghost':
          graphics.fillRoundedRect(5, 5, 20, 25, { tl: 10, tr: 10, bl: 0, br: 0 });
          graphics.fillStyle(0x000000, 1);
          graphics.fillCircle(10, 12, 2);
          graphics.fillCircle(20, 12, 2);
          break;
        case 'diamond':
          graphics.fillTriangle(15, 0, 0, 15, 30, 15);
          graphics.fillTriangle(15, 30, 0, 15, 30, 15);
          break;
        case 'hexagon':
          graphics.fillPoints([{x:7,y:0}, {x:23,y:0}, {x:30,y:15}, {x:23,y:30}, {x:7,y:30}, {x:0,y:15}], true);
          break;
        case 'spaceship':
          graphics.fillTriangle(0, 30, 15, 0, 30, 30);
          break;
        case 'car':
          graphics.fillRect(0, 5, 40, 20);
          graphics.fillRect(5, 0, 30, 10); // Car roof
          break;
        case 'snake':
          graphics.fillRoundedRect(0, 0, 30, 30, 8);
          graphics.fillStyle(0xffffff, 1);
          graphics.fillCircle(10, 10, 3); graphics.fillCircle(20, 10, 3);
          break;
        case 'bird':
          graphics.fillCircle(15, 15, 15);
          graphics.fillStyle(0xffcc00, 1); graphics.fillTriangle(25, 15, 25, 22, 35, 18);
          graphics.fillStyle(0x000000, 1); graphics.fillCircle(20, 12, 2);
          break;
        default:
          graphics.fillRect(0, 0, 30, 30);
      }
    }

    createGraphics() {
      // Clear all textures
      this.textures.list && Object.keys(this.textures.list).forEach(key => {
        if (key !== '__DEFAULT' && key !== '__MISSING') this.textures.remove(key);
      });

      // Background
      const bg = this.add.graphics();
      bg.fillStyle(Phaser.Display.Color.HexStringToColor(gameConfig.background || '#111111').color, 1);
      bg.fillRect(0, 0, 800, 450);
      bg.generateTexture('bg', 800, 450);
      bg.destroy();

      // Player
      const pg = this.add.graphics();
      const pShape = gameConfig.player.shape || gameConfig.player.type || 'square';
      this.drawShape(pg, pShape, gameConfig.player.color);
      pg.generateTexture('player_tex', 40, 30);
      pg.destroy();

      // Entities (Support both entities array AND legacy obstacles object)
      const entityPool = gameConfig.entities || (gameConfig.obstacles ? [{ 
        ...gameConfig.obstacles, 
        name: gameConfig.obstacles.type, 
        shape: gameConfig.obstacles.type, 
        color: (gameConfig.obstacles.type === 'food' || gameConfig.obstacles.type === 'fruit') ? '#ff3333' : '#ff5555',
        behavior: gameConfig.mechanic === 'catch' ? 'collect' : 'avoid',
        spawnChance: 1.0 
      }] : []);

      this.sceneEntities = entityPool; // Store for spawning

      entityPool.forEach((entity, index) => {
        const eg = this.add.graphics();
        this.drawShape(eg, entity.shape || entity.type, entity.color);
        eg.generateTexture(`entity_tex_${index}`, 40, 40);
        eg.destroy();
      });
    }

    create() {
      this.add.image(400, 225, 'bg');
      this.score = 0;
      this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff', fontFamily: 'Outfit' });
      this.scoreText.setDepth(10);

      const startX = (gameConfig.gameType === 'racing' || gameConfig.gameType === 'shooter') ? 100 : 400;
      const startY = (gameConfig.gameType === 'racing' || gameConfig.gameType === 'shooter') ? 225 : 350;
      
      this.player = this.physics.add.sprite(startX, startY, 'player_tex');
      this.player.setCollideWorldBounds(true);
      this.player.setScale(gameConfig.player.size || 1.0);

      this.entitiesGroup = this.physics.add.group();

      // Individual collision logic
      this.physics.add.overlap(this.player, this.entitiesGroup, (player, entitySprite) => {
        const behavior = entitySprite.getData('behavior');
        if (behavior === 'collect') {
          entitySprite.destroy();
          this.score += 10;
          this.scoreText.setText('Score: ' + Math.floor(this.score));
          this.tweens.add({ targets: this.player, scale: (gameConfig.player.size || 1.0) * 1.2, duration: 100, yoyo: true });
        } else {
          this.hitObstacle();
        }
      });

      this.cursors = this.input.keyboard.createCursorKeys();

      // Use a default frequency if not provided (check both places)
      const frequency = (gameConfig.obstacles && gameConfig.obstacles.frequency) || 1500;
      this.spawnTimer = this.time.addEvent({
        delay: frequency,
        callback: this.spawnEntity,
        callbackScope: this,
        loop: true
      });
    }

    spawnEntity() {
      if (!this.sceneEntities || this.sceneEntities.length === 0) return;

      // Pick a random entity from the array
      const index = Phaser.Math.Between(0, this.sceneEntities.length - 1);
      const config = this.sceneEntities[index];

      let x, y, velX, velY;
      if (gameConfig.gameType === 'racing' || gameConfig.gameType === 'shooter') {
        x = 850;
        y = Phaser.Math.Between(50, 400);
        velX = -config.speed;
        velY = 0;
      } else {
        x = Phaser.Math.Between(50, 750);
        y = -50;
        velX = 0;
        velY = config.speed;
      }

      const entity = this.entitiesGroup.create(x, y, `entity_tex_${index}`);
      entity.setData('behavior', config.behavior);
      entity.setVelocity(velX, velY);
      entity.body.allowGravity = gameConfig.gameType === 'platformer';
    }

    update() {
      if (this.isGameOver) return;

      // Cleanup
      this.entitiesGroup.getChildren().forEach(ent => {
        if (ent.x < -100 || ent.x > 900 || ent.y > 600 || ent.y < -100) ent.destroy();
      });

      const speed = gameConfig.player.speed;
      if (gameConfig.gameType === 'platformer') {
        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
        else this.player.setVelocityX(0);

        if (this.cursors.up.isDown && this.player.body.blocked.down) {
          this.player.setVelocityY(-speed * 1.5);
        }
      } else {
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
      }
    }

    hitObstacle() {
      if (this.isGameOver) return;
      this.isGameOver = true;
      this.physics.pause();
      this.player.setTint(0xff0000);
      
      const gameOverText = this.add.text(400, 225, 'GAME OVER\nClick to Restart', { 
        fontSize: '40px', fill: '#fff', align: 'center', fontFamily: 'Outfit'
      });
      gameOverText.setOrigin(0.5).setDepth(20);

      this.input.on('pointerdown', () => {
        this.isGameOver = false;
        this.scene.restart();
      });
    }
  };
}
