class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload () {
        this.load.image('tiles', './assets/gridtiles2.png');
        this.load.image('tiles', './assets/gridtiles2.png');
        this.load.tilemapTiledJSON('map', './assets/simple-map.json');
        this.load.image('sky', './assets/sky.png');
        this.load.image('ground', './assets/platform.png');
        this.load.image('saw1', './assets/spike1.png');
        this.load.image('saw2', './assets/platform.png');
        this.load.image('saw3', './assets/platform.png');
        this.load.image('star', './assets/star.png');
        this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('sun', './assets/sun.png');
        this.load.image('alien', './assets/space-baddie.png');
        this.load.image('bullet', './assets/star.png');
        this.load.image('back', './assets/background.png');
        this.load.image('star_animation', './assets/star_animation.png');
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_jump', './assets/jump.wav');
        this.load.audio('sfx_shoot', './assets/shoot.wav');
    }
    create () {
        this.background = this.add.sprite(400, 300, 'back');
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(0, 0, 800 * 2, 600 * 2);
    //this.physics.world.setBounds(0, 0, 800 * 2, 600 * 2);

    this.ammo = 1.05;
    this.text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);
    this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    this.tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createLayer('Level1', this.tileset);
    
    
    this.map.setCollision([ 20, 48 ]);

    this.pickups = this.map.filterTiles(function (tile) {
        return (tile.index === 82);
    });

    this.platforms = this.physics.add.staticGroup();

    ////this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    /* movingSaw1 = this.physics.add.image(400, 400, 'saw1');
    movingSaw1.scaleX= 2.5;
    movingSaw1.setImmovable(true);
    movingSaw1.body.allowGravity = false;
    movingSaw1.setVelocityY(80);

    movingSaw2 = this.physics.add.image(400, 400, 'saw2');
    movingSaw2.setImmovable(true);
    movingSaw2.body.allowGravity = false;
    movingSaw2.setVelocityX(100);

    movingSaw3 = this.physics.add.image(400, 400, 'saw3');
    movingSaw3.setImmovable(true);
    movingSaw3.body.allowGravity = false;
    movingSaw3.setVelocityY(150);
    */

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.01);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, this.layer);

    this.cameras.main.startFollow(player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1);
    

    //this.cameras.main.startFollow(player);
    //this.cameras.main.followOffset.set(-200, 0);

    //enemy2 = this.physics.add.sprite(1050,850, 'alien');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, this.platforms);
    //this.physics.add.collider(player, movingSaw1);
    this.physics.add.collider(player, this.movingPlatform);

    this.fueltext = this.add.text(player.x, player.y - 20, '', { fill: '#D5E27B' }).setDepth(1);
    this.scoretext = this.add.text(player.x, player.y - 30, '', { fill: '#D5E27B' }).setDepth(1);

    // timer implementation
}

// updating assets
update ()
{   
    this.fueltext.x = player.x;
    this.fueltext.y = player.y - 20;
    this.scoretext.x = player.x;
    this.scoretext.y = player.y - 40;
    // detecting Game Over
    if(playerCollision == true){
        gameOver = true;
    }
    // full game over detection
    if(gameOver == true){
        gameOverText = this.add.text(320, 240, 'GAME OVER', { fontSize: '32px', fill: '#fff' });
        restartText = this.add.text(290, 330, 'Press <- to restart', { fontSize: '22px', fill: '#fff' });
        // TODO: implement restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            debugText = this.add.text(10, 10, 'GAME OVER', { fontSize: '12px', fill: '#fff' });
            this.scene.start("menuScene");
            }
    }
    
    this.text.setText([
        'Game Over: ' + gameOver,
        'Score: ' + score,
        'speed:' + speedinc,
    ]);
    this.fueltext.setText([
        'fuel:' + fuel,
    ]);
    this.scoretext.setText([
        'score:' + score,
    ]);


    if (cursors.left.isDown)
    {
        player.setVelocityX(-320);
        player.anims.play('left', true);
        player.x -= 2.5;


    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(320);
        player.anims.play('right', true);
        player.x += 2.5;

    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');

    }


    

    if (cursors.up.isDown && speedinc >= -300 && fuel >= 10)
    {
        player.setVelocityY(speedinc);
        speedinc -= 10;
        fuel -= 10;
        
    }
    else if (speedinc <= 10 && fuel < 2100 )
    {
        player.setVelocityY(speedinc);
        speedinc += 15;
    }
    else if (fuel < 2000 && player.body.blocked.down)
    {
        fuel += 10;
        speedinc = 10
    }
    
    
    /*
    if (movingSaw1.x >= 500)
    {
        movingSaw1.setVelocityX(-50);
    }
    else if (movingSaw1.x <= 300)
    {
        movingSaw1.setVelocityX(50);
    }
    */
    this.physics.world.overlapTiles(player, this.pickups, this.hitPickup, null, this);
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
}
//
// end of update
//

reset(){

}



// pick up function
hitPickup (player, tile)
{
    this.map.removeTile(tile, 29, false);

    this.pickups = this.map.filterTiles(function (tile) {
        score += 10;
        fuel = 2000;
        
        return (tile.index === 82);
    });
}


checkPlayerCollision(player, enemy) {
    if (player.x < enemy.x + enemy.width && 
        player.x + player.width > enemy.x && 
        player.y < enemy.y + enemy.height &&
        player.height + player.y > enemy. y){
            playerCollision = true;
            return true;
        }
        else{
            return false;
        }

}





    
}