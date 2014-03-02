/** @jsx React.DOM */
define([
    'jquery',
    'underscore'
], function($, _) {

    var Combination = function(obj) {
        this.initialize(obj);
    };

    _(Combination.prototype).extend({

        initialize: function() {
            this.combination = this.generateCombination();
            this.checkStages = this.getInitialCheckStages(this.combination);
            this.lockOpened = false;
        },

        tryAgain: function() {
            console.log('trying');
            this.initialize();
        },

        generateCombination: function() {
            return [
                this.getRandomInt(25, 39),
                this.getRandomInt(15, 24),
                this.getRandomInt(2, 14)
            ];
        },

        getCombination: function() {
            return this.combination;
        },

        getInitialCheckStages: function(combination) {
            return  _([{
                stage: 1,
                state: 'pending',
                foundCount: 0,
                matchNum: combination[0],
                turnCheck: function(prevNum, currNum) {
                    //decreasing, 0 to 40 allowed
                    return (prevNum > currNum) || ((prevNum - currNum) < -38);
                },
                matchCheck: function(prevNum, currNum) {
                    return (prevNum == this.matchNum + 1) && (currNum == this.matchNum);
                },

                foundCheck: function() {
                    return this.foundCount == 3;
                }

            }, {
                stage: 2,
                state: false,
                foundCount: 0,
                matchNum: combination[1],
                turnCheck: function(prevNum, currNum) {
                    //increasing, 40 to 0 allowed
                    return (prevNum < currNum)||((prevNum - currNum) > 38);
                },
                matchCheck: function(prevNum, currNum) {
                    return (prevNum == this.matchNum - 1) && (currNum == this.matchNum);
                },

                foundCheck: function() {
                    return this.foundCount == 2;
                }
            },{
                stage: 3,
                state: false,
                foundCount: 0,
                matchNum: combination[2],
                turnCheck: function(prevNum, currNum) {
                    //decreasing, 0 to 40 allowed
                    return (prevNum > currNum) || ((prevNum - currNum) < -38);
                },
                matchCheck: function(prevNum, currNum) {
                    return (prevNum == this.matchNum + 1) && (currNum == this.matchNum);
                },

                foundCheck: function() {
                    return this.foundCount == 1;
                }

            }]).clone();
        },

        checkCombination: function(numberSequence, combinationCheckStages) {
            for(var i=1; i<numberSequence.length; i++) {
                var currNum = numberSequence[i];
                var prevNum = numberSequence[i-1];
                var currStage = _.filter(combinationCheckStages, function(stage) {
                    return stage.state == 'pending';
                })[0];

                if(!currStage.turnCheck(prevNum, currNum)) {
                    combinationCheckStages = this.getInitialCheckStages(this.combination);
                    continue;
                }

                if(currStage.matchCheck(prevNum, currNum)) {
                    currStage.foundCount ++;
                }

                if(currStage.foundCheck()) {

                    currStage.state = true;
                    if(currStage.stage < 3) {
                        combinationCheckStages[currStage.stage].state = 'pending';
                    }
                }

                if(_.every(combinationCheckStages, function(stage) {
                    return stage.state == true;
                })) {
                    this.lockOpened = true;
                    return combinationCheckStages;
                };
            }
            return combinationCheckStages;
        },

        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getNumberFromAngle: function(angle) {
            var angleMod = angle % 360;
            var number = 0;
            if(angleMod > 0) {
                number = Math.round(40 - Math.abs(angleMod/9));
            }
            if(angleMod < 0) {
                number = Math.round(Math.abs(angleMod/9));
            }
            return number;
        },

        calculateAngle: function(xRelCenter, yRelCenter) {
            var hypotenuse = Math.sqrt(Math.pow(xRelCenter,2) + Math.pow(yRelCenter,2));
            if(hypotenuse == 0) { return 0; }
            var sin = xRelCenter/hypotenuse;

            //adjust for second quadrant
            var angleInRad = (Math.asin(sin));

            if(yRelCenter > 0 && xRelCenter >= 0) {
                angleInRad = Math.PI - angleInRad;
            }

            if(yRelCenter > 0 && xRelCenter < 0) {
                angleInRad = -1 * Math.PI - angleInRad;
            }
//            if(yRelCenter > 0) {
//                angleInRad = angleInRad == 0 ? Math.PI : (angleInRad + (angleInRad/Math.abs(angleInRad)) * Math.PI/2);
//            }
            //return in degrees
            return angleInRad * (180/Math.PI);
        },

        calculateClosestAngle: function(prevAngle, currAngle) {

            return Math.floor(prevAngle/360) * 360 + currAngle;
        }
    });

    return Combination;
});
