/** @jsx React.DOM */
define([
    'jquery',
    'underscore',
    'react',
    'js/lock-mechanism'
], function($, _, React, LockMechanism) {

    var OpenMePrompt = React.createClass({

        handleButtonClick: function() {
            //this.props.lockMechanism.tryAgain();
        },

        render: function() {
            return (<div className="open-prompt">
                <div
                    className="button"
                    onClick={this.handleButtonClick}
                >Try Again!</div>
                <div>{this.props.lockMechanism.combination[0] + "-" +
                    this.props.lockMechanism.combination[1] + "-" +
                    this.props.lockMechanism.combination[2]}</div>
                <div>{this.props.angle}</div>
                <div>{this.props.number}</div>
                <div className="message">{this.props.lockMechanism.lockOpened ? 'Opened!' : 'Locked'}</div>
            </div>);
        }

    });

    var Padlock = React.createClass({

        getInitialState: function() {
            return {
                previousAngle: 0,
                previousNumber: 0,
                numberSequence: [],
                lockOpened: false
            };
        },

        handleClick: function(event) {

            var angle = this.getEventAngle(event.pageX, event.pageY);
            var number = this.props.lockMechanism.getNumberFromAngle(angle);
            console.log('previous angle: ' + this.state.previousAngle);
            var closestAngle = this.props.lockMechanism.calculateClosestAngle(this.state.previousAngle, angle);

            if(number != this.state.previousNumber) {
                this.state.numberSequence.push(number);
                this.props.lockMechanism.checkCombination(this.state.numberSequence,
                    this.props.lockMechanism.getInitialCheckStages(this.props.lockMechanism.getCombination()));
            }

            this.setState({
                previousAngle: angle,
                previousNumber: number
            });
            console.log('closest angle: ' + closestAngle);
            // For webkit browsers: e.g. Chrome
            $('.turn-knob').css({ WebkitTransform: 'rotate(' + angle + 'deg)'});
            // For Mozilla browser: e.g. Firefox
            $('.turn-knob').css({ '-moz-transform': 'rotate(' + angle + 'deg)'});
        },

        handleMouseMove: function(event) {
            this.handleClick(event);
        },

        handleMouseEnter: function(event) {
            //var enterAngle = this.getEventAngle(event);
        },

        handleTouchStart: function(event) {
            event.preventDefault();
        },

        handleTouchMove: function(event) {
            event.preventDefault();
            this.handleClick({
                pageX: event.changedTouches[0].pageX,
                pageY: event.changedTouches[0].pageY
            })
        },

        getEventAngle: function(pageX, pageY) {
            //getting offset from stationary parent elem, because offset changes with rotation
            var elemXRelDoc = $('.turn-knob-parent').offset().left,
                elemYRelDoc = $('.turn-knob-parent').offset().top;
            var elemWidth = $('.turn-knob-parent').width();
            var elemHeight = $('.turn-knob-parent').height();

            var cursorXRelDoc = pageX;
            var cursorYRelDoc = pageY;

            var elemCenterX = elemXRelDoc + elemWidth/2;
            var elemCenterY = elemYRelDoc + elemHeight/2;

            var cursorXRelElemCenter = ( cursorXRelDoc - elemCenterX );
            var cursorYRelElemCenter = (cursorYRelDoc - elemCenterY);

            console.log('x,y from center: ' + cursorXRelElemCenter + ',' + cursorYRelElemCenter);
            return this.props.lockMechanism.calculateAngle(cursorXRelElemCenter, cursorYRelElemCenter);
        },

        render: function() {

            return (
                <div>
                    <OpenMePrompt
                        lockMechanism={this.props.lockMechanism}
                        angle={this.state.previousAngle}
                        number={this.state.previousNumber}
                        lockOpened={this.state.lockOpened}
                    />
                    <div
                        className="lock"
                    >
                        <img src="images/lockBody.png" />
                    </div>
                    <div
                        className="turn-knob-parent"
                    >
                        <div
                            className="turn-knob"
                            onClick={this.handleClick}
                            onMouseMove={this.handleMouseMove}
                            onTouchStart={this.handleTouchStart}
                            onTouchMove={this.handleTouchMove}
                            onMouseEnter={this.handleMouseEnter}
                        >
                            <img src="images/turn-knob2.png"/>
                        </div>
                    </div>
                </div>);
        }
    });

    var lockMechanism = new LockMechanism();
    React.initializeTouchEvents(true);
//    document.ontouchmove = function(event){
//        event.preventDefault();
//    };
    React.renderComponent(
        <Padlock
            lockMechanism={lockMechanism}
        />,
        $('#container').get(0)
    );

    return Padlock;
});
