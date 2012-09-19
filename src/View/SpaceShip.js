define(
    [
        'Model/Weapon/Shot',
        'View/Weapon/Laser',
        'View/Weapon/BigLaser',
        'View/Weapon/DoubleLaser',
        'View/Weapon/Missile',
        'Model/Math'
    ],
    function (ShotModel, Laser, BigLaser, DoubleLaser, Missile, Mathematic) {
        'use strict';
        var View = View || {};
        View.SpaceShip = Backbone.View.extend({
            scaning: {},

            game: null,

            /**
             * init stuff
             *
             * @return void
             */
            initialize: function () {
                this.game = this.options.game;
                // events
                this.model.on('change:isDestroyed', $.proxy(this.onDestroy, this));
                this.model.on('change:currentShield', $.proxy(this.onHitShield, this));
                this.model.on('change:currentArmor', $.proxy(this.onHitArmor, this));
                this.model.on('follow', $.proxy(this.onFollow, this));

                $('body').on('stop_scanning_for_enemies', $.proxy(this.stopScaning, this));

                // reset weapon scaning
                this.scaning = {};

                // let weapons scan for enemies
                var weapons = this.model.get('weapons'),
                    index,
                    key;

                for (index in weapons) {
                    if (weapons.hasOwnProperty(index)) {
                        key = weapons[index].coordX + '_' + weapons[index].coordY;
                        this.scaning[key] = window.setInterval($.proxy(this.scan, this, weapons[index]), Math.floor(Math.random() * 500 +  weapons[index].firefrequence));
                    }
                }
            },

            /**
             * Checks if an enemy is attackable
             *
             * @param object enemy
             * @param object weapon
             *
             * @return void
             */
            isAttackable: function (enemy, weapon) {
                var Px,
                    Py,
                    Mx = weapon.positionX + weapon.width / 2,
                    My = weapon.positionY + weapon.height / 2,
                    radius = weapon.firerange * weapon.firerange;

                Px = enemy.get('positionX');
                Py = enemy.get('positionY');

                if (Mathematic.isPointInCircle(Px, Py, Mx, My, radius)) {
                    return true;
                }

                Px = enemy.get('positionX') + enemy.get('width');
                Py = enemy.get('positionY');

                if (Mathematic.isPointInCircle(Px, Py, Mx, My, radius)) {
                    return true;
                }

                Px = enemy.get('positionX') + enemy.get('width');
                Py = enemy.get('positionY') + enemy.get('height');

                if (Mathematic.isPointInCircle(Px, Py, Mx, My, radius)) {
                    return true;
                }

                Px = enemy.get('positionX');
                Py = enemy.get('positionY') + enemy.get('height');

                if (Mathematic.isPointInCircle(Px, Py, Mx, My, radius)) {
                    return true;
                }

                return false;
            },

            /**
             * Scan location for enemies and attack them.
             *
             * @param  object weapon - current scaning weapon
             *
             * @return void
             */
            scan: function (weapon) {
                var enemy = this.model.get('follow'),
                    items,
                    i;

                if (enemy && this.isAttackable(enemy, weapon)) {
                    return this.attack(enemy, weapon);
                }

                items = this.game.battlefield.items;

                for (i in items) {
                    if (items.hasOwnProperty(i)) {
                        // do not attack your own units
                        if (items[i].model.get('owner') === this.model.get('owner')) {
                            continue;
                        }

                        // item is not attackable
                        if (!items[i].model.get('isAttackable')) {
                            continue;
                        }

                        // missiles cant attack missiles
                        if (weapon.type === 'rocketlauncher' && items[i].model.get('type') === 'missile') {
                            continue;
                        }

                        if (this.isAttackable(items[i].model, weapon)) {
                            return this.attack(items[i].model, weapon);
                        }
                    }
                }

                weapon.direction = null;
            },

            /**
             * Moving the spaceship to a position.
             *
             * @param  integer x destination x - position
             * @param  integer y destination y - position
             *
             * @return void
             */
            move: function (x, y) {
                var direction,
                    follower,
                    i,
                    Px1 = this.model.get('positionX'),
                    Py1 = this.model.get('positionY'),
                    Px2 = x - this.model.get('width') / 2,
                    Py2 = y - this.model.get('height') / 2;

                this.model.set('destinationPositionX', Px2);
                this.model.set('destinationPositionY', Py2);
                this.model.set('direction', Mathematic.getAngle(Px1, Py1, Px2, Py2));

                // follower = this.model.get('follower');
                // for (i in follower) {
                //     if (follower.hasOwnProperty(i)) {
                //         follower[i].trigger('follow', this.model);
                //     }
                // }
            },

            /**
             * Handles a hit on the shield.
             *
             * @param  object   model - ship model
             * @param  integer  value - current shield
             *
             * @return void
             */
            onHitShield: function (model, value) {
                this.game.battlefield.ctx.beginPath();
                this.game.battlefield.ctx.arc(
                    this.model.get('positionX') + this.model.get('width') / 2,
                    this.model.get('positionY') + this.model.get('height') / 2,
                    this.model.get('width') / 2 + 5,
                    0,
                    Math.PI * 2,
                    false
                );

                this.game.battlefield.ctx.fillStyle = "rgba(17, 92, 177, 0.4)";
                this.game.battlefield.ctx.fill();
                this.game.battlefield.ctx.closePath();
            },

            /**
             * Handles a hit on the ship it self.
             *
             * @param  object   model - ship model
             * @param  integer  value - current armor
             *
             * @return void
             */
            onHitArmor: function (model, value) {
                var unitId = $('#status_bar').attr('data-unitid');
                if (unitId == this.model.get('id')) {
                    var armor = 100 - (this.model.get('currentArmor') / this.model.get('maxArmor') * 100);
                    $('#currentArmor').css({height: armor});
                }

                if (value <= 0) {
                    model.set('isDestroyed', true);

                    if (unitId == this.model.get('id')) {
                        $('#spaceship').hide();
                        $('#armor').hide();
                        $('#weapons').hide();
                    }
                }
            },

            /**
             * Follow the enemy.
             *
             * @param object enemy
             *
             * @return void
             */
            onFollow: function (enemy) {
                var x = enemy.get('positionX') + this.model.get('distanceX'),
                    y = enemy.get('positionY') + this.model.get('distanceY');

                if (x > this.game.battlefield.canvas.width) {
                    x = this.game.battlefield.canvas.width - this.model.get('width');
                }

                if (y > this.game.battlefield.canvas.height) {
                    y = this.game.battlefield.canvas.height - this.model.get('height');
                }

                this.move(x, y);
            },


            /**
             * attack an enemy
             *
             * @param  object  enemy - model of enemy
             * @param  object  weapon - the weapon to attack the enemy
             *
             * @return void
             */
            attack: function (enemy, weapon) {
                var Px1 = weapon.positionX,
                    Py1 = weapon.positionY,
                    Px2 = enemy.get('positionX') + enemy.get('width') / 2,
                    Py2 = enemy.get('positionY') + enemy.get('height') / 2,
                    angle = Mathematic.getAngle(Px1, Py1, Px2, Py2),
                    shotModel = new ShotModel(),
                    shot = null,
                    self = this;

                shotModel.set('id', ++this.game.idCounter);
                shotModel.set('owner', this.model.get('owner'));
                shotModel.set('positionX', weapon.positionX);
                shotModel.set('positionY', weapon.positionY);
                shotModel.set('firepower', weapon.firepower);
                shotModel.set('firespeed', weapon.firespeed);
                shotModel.set('angle', angle);
                shotModel.set('enemy', enemy);

                if (weapon.type === 'rocketlauncher') {
                    shotModel.set('isUnit', false);
                    shotModel.set('width', 20);
                    shotModel.set('height', 20);
                    shotModel.set('isAttackable', true);
                    shotModel.set('currentArmor', 8);
                    shotModel.set('isDestroyed', false);
                    shotModel.on('change:currentArmor', function (model, value) {
                        if (value <= 0) {
                            self.game.battlefield.remove(shotModel.get('id'));
                        }
                    });
                }

                weapon.direction = angle;

                switch (weapon.type) {
                case 'laser':
                    shot = new Laser({
                        model: shotModel,
                        game: this.game
                    });
                    break;
                case 'biglaser':
                    shot = new BigLaser({
                        model: shotModel,
                        game: this.game
                    });
                    break;
                case 'doublelaser':
                    shot = new DoubleLaser({
                        model: shotModel,
                        game: this.game
                    });
                    break;
                case 'rocketlauncher':
                    shot = new Missile({
                        model: shotModel,
                        game: this.game
                    });
                    break;
                default: return;
                }

                if (weapon.type === 'rocketlauncher') {
                    this.game.battlefield.add(shot);
                } else {
                    this.game.battlefield.addObject(shot);
                }

                shot.fire();
            },

            /**
             * Check if unit has to be moved and than update the position for rendering/drawing.
             *
             * @param integer modifier - time 
             *
             * @return void
             */
            updatePosition: function (modifier) {
                if (this.model.get('destinationPositionX') === Math.round(this.model.get('positionX')) && this.model.get('destinationPositionY') === Math.round(this.model.get('positionY'))) {
                    return;
                }

                var speed = this.model.get('speed') * modifier,
                    speedX,
                    speedY,
                    a = Math.abs(this.model.get('destinationPositionX') - this.model.get('positionX')) / speed,
                    b = Math.abs(this.model.get('destinationPositionY') - this.model.get('positionY')) / speed;

                // set right speed for x and y distance
                if (a >= b) {
                    speedX = speed;
                    speedY = (b / a) * speed;
                } else {
                    speedX = (a / b) * speed;
                    speedY = speed;
                }

                // setting new postion
                if (this.model.get('destinationPositionX') < this.model.get('positionX')) {
                    this.model.set('positionX', (this.model.get('positionX') - speedX));
                }

                if (this.model.get('destinationPositionX') > this.model.get('positionX')) {
                    this.model.set('positionX', (this.model.get('positionX') + speedX));
                }

                if (this.model.get('destinationPositionY') < this.model.get('positionY')) {
                    this.model.set('positionY', (this.model.get('positionY') - speedY));
                }

                if (this.model.get('destinationPositionY') > this.model.get('positionY')) {
                    this.model.set('positionY', (this.model.get('positionY') + speedY));
                }


                var follower = this.model.get('follower');
                for (i in follower) {
                    if (follower.hasOwnProperty(i)) {
                        follower[i].trigger('follow', this.model);
                    }
                }
            },

            /**
             * Handler if unit is destroyed by enemy.
             *
             * @param object model - model of destroyed spaceship
             *
             * @return void
             */
            onDestroy: function (model) {
                var i,
                    self = this,
                    x = 0,
                    y = 0,
                    w = 118,
                    h = 118,
                    dx = model.get('positionX') - 54,
                    dy = model.get('positionY') - 54,
                    dw = 118,
                    dh = 118,
                    animation,
                    follower;

                // removing unit/item from battlefield
                this.game.battlefield.remove(this.model.get('id'));

                // clean all weapon scanings
                this.stopScaning();

                follower = this.model.get('follower');
                for (i in follower) {
                    follower[i].set('follow', null);
                }
                this.model.set('follower', []);

                if (this.model.get('owner') === 'computer') {
                    this.game.user.model.set('money', this.game.user.model.get('money') + this.model.get('headMoney'));
                }

                // display explosion
                animation = window.setInterval(function () {
                    // window.battlefield.ctx.drawImage(
                    //     window.GameImages.explosion,
                    //     x,
                    //     y,
                    //     w,
                    //     h,
                    //     dx,
                    //     dy,
                    //     dw,
                    //     dh
                    // );

                    if (x === (5 * 118)) {
                        window.clearInterval(animation);
                        $('body').trigger('check_goal', [self.model]);
                        return;
                    }
                    x += 118;
                }, 10);
            },

            /**
             * Draws the weapons of the spaceship.
             *
             * @param object weapon - current weapon to draw
             *
             * @return void
             */
            drawWeapon: function (weapon) {
                var Mx = this.model.get('positionX') + this.model.get('width') / 2,
                    My = this.model.get('positionY') + this.model.get('height') / 2,
                    x = Mx + weapon.coordX,
                    y = My + weapon.coordY,
                    alpha = this.model.get('direction') || 0,
                    newX = (x - Mx) * Math.cos(alpha) - (y - My) * Math.sin(alpha) + Mx,
                    newY = (x - Mx) * Math.sin(alpha) + (y - My) * Math.cos(alpha) + My;

                weapon.positionX = newX;
                weapon.positionY = newY;

                 // if (this.model.get('selected')) {
                 //     window.battlefield.ctx.beginPath();
                 //     window.battlefield.ctx.arc(weapon.positionX, weapon.positionY, weapon.firerange, 0, Math.PI*2, false);
                 //     window.battlefield.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
                 //     window.battlefield.ctx.fill();
                 //     window.battlefield.ctx.lineWidth = 1;
                 //     window.battlefield.ctx.strokeStyle = 'red';
                 //     window.battlefield.ctx.stroke();
                 //     window.battlefield.ctx.closePath();
                 // }

                this.game.battlefield.ctx.save();

                this.game.battlefield.ctx.translate(newX, newY);
                if (weapon.direction) {
                    this.game.battlefield.ctx.rotate(weapon.direction);
                } else {
                    this.game.battlefield.ctx.rotate(this.model.get('direction'));
                }
                this.game.battlefield.ctx.drawImage(this.game.getImage(weapon.type), -weapon.width / 2, -weapon.height / 2, weapon.width, weapon.height);
                this.game.battlefield.ctx.restore();
            },

            stopScaning: function () {
                var i;
                for (i in this.scaning) {
                    if (this.scaning.hasOwnProperty(i)) {
                        window.clearInterval(this.scaning[i]);
                    }
                }
            },

            /**
             * Drawing everything. The spaceship, the armor, the shield and the weapons.
             *
             * @param integer modifier - time
             *
             * @return void
             */
            draw: function (modifier) {
                var armor = this.model.get('width') / 100 * (this.model.get('currentArmor') / this.model.get('maxArmor') * 100),
                    shield = 0,//this.model.get('width') / 100 * (this.model.get('currentShield') / this.model.get('maxShield') * 100),
                    x = (-1 * this.model.get('width') / 2),
                    y = (-1 * this.model.get('height') / 2),
                    weapons = this.model.get('weapons'),
                    key;

                this.updatePosition(modifier);

                // MARK SHIP AS SELECTED
                if (this.model.get('selected')) {
                    this.game.battlefield.ctx.beginPath();
                    this.game.battlefield.ctx.arc(this.model.get('positionX') + this.model.get('width') / 2, this.model.get('positionY') + this.model.get('height') / 2, this.model.get('width') / 2 + 2, 0, Math.PI * 2, false);
                    this.game.battlefield.ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
                    this.game.battlefield.ctx.fill();
                    this.game.battlefield.ctx.lineWidth = 1;
                    this.game.battlefield.ctx.strokeStyle = 'green';
                    this.game.battlefield.ctx.stroke();
                    this.game.battlefield.ctx.closePath();
                }

                // ROTATE
                this.game.battlefield.ctx.save();
                this.game.battlefield.ctx.translate(this.model.get('positionX') + this.model.get('width') / 2, this.model.get('positionY') + this.model.get('height') / 2);
                this.game.battlefield.ctx.rotate(this.model.get('direction'));

                // ARMOR BAR
                this.game.battlefield.ctx.fillStyle = 'red';
                this.game.battlefield.ctx.fillRect(x, y - 4, this.model.get('width'), 4);
                this.game.battlefield.ctx.fillStyle = 'green';
                this.game.battlefield.ctx.fillRect(x, y - 4, armor, 4);

                // SHIELD BAR
                this.game.battlefield.ctx.fillStyle = '#115cb1';
                this.game.battlefield.ctx.fillRect(x, y - 8, shield, 4);

                // SPACESHIP
                this.game.battlefield.ctx.drawImage(this.game.getImage(this.model.get('type')), x, y, this.model.get('width'), this.model.get('height'));
                this.game.battlefield.ctx.restore();

                // WEAPONS
                for (key in weapons) {
                    if (weapons.hasOwnProperty(key)) {
                        this.drawWeapon(weapons[key]);
                    }
                }
            }
        });

        return View.SpaceShip;
    }
);