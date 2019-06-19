import React, {Component} from "react";

class Countdown extends Component {
    state = {
        timerOn: false,
        // timerTime: 600000, // seconds to countdown in milliseconds
        timerTime: 100000, // seconds to countdown in milliseconds
        timerStart: 0,
        refreshMillis: 500
    };

    startTimer = () => {
        this.setState({
            timerOn: true,
            timerTime: this.state.timerTime,
            timerStart: this.state.timerTime
        });

        this.timer = setInterval(() => {
            const newTime = this.state.timerTime - this.state.refreshMillis;
            if (newTime >= 0) {
                this.setState({
                    timerTime: newTime
                });
                const timerPercent = 1-(newTime / this.state.timerStart)
                this.props.updateActivityProgress(timerPercent)
            } else {
                clearInterval(this.timer);
                this.setState({timerOn: false});
                this.props.timerCompleteCB();
                this.stopTimer();
            }
        }, this.state.refreshMillis);
    };

    stopTimer = () => {
        clearInterval(this.timer);
        this.setState({timerOn: false});
    };
    resetTimer = () => {
        if (this.state.timerOn === false) {
            this.setState({
                timerTime: this.state.timerStart
            });
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.timerStarted !== prevProps.timerStarted) {
            if (this.props.timerStarted && this.state.timerOn === false) {
                this.startTimer()
            }
        }
    }


    render() {
        const {timerTime, timerStart, timerOn} = this.state;
        let seconds = ("0" + (Math.floor((timerTime / 1000) % 60) % 60)).slice(-2);
        let minutes = ("0" + Math.floor((timerTime / 60000) % 60)).slice(-2);


        return (
            <div className="Countdown">
                <div className="Countdown-header">Countdown</div>
                <div className="Countdown-label">Minutes : Seconds</div>
                <div className="Countdown-display">
                    <div className="Countdown-time">
                        {minutes} : {seconds}
                    </div>

                </div>

                {/*{timerOn === false && (timerStart === 0 || timerTime === timerStart) && (*/}
                {/*<button className="Button-start" onClick={this.startTimer}>*/}
                {/*{this.props.startText}*/}
                {/*</button>*/}
                {/*)}*/}
                {/*{timerOn === true && timerTime >= 1000 && (*/}
                {/*<button className="Button-stop" onClick={this.stopTimer}>*/}
                {/*Stop*/}
                {/*</button>*/}
                {/*)}*/}
                {/*{timerOn === false &&*/}
                {/*(timerStart !== 0 && timerStart !== timerTime && timerTime !== 0) && (*/}
                {/*<button className="Button-start" onClick={this.startTimer}>*/}
                {/*Resume*/}
                {/*</button>*/}
                {/*)}*/}

                {/*{(timerOn === false || timerTime < 1000) &&*/}
                {/*(timerStart !== timerTime && timerStart > 0) && (*/}
                {/*<button className="Button-reset" onClick={this.resetTimer}>*/}
                {/*Reset*/}
                {/*</button>*/}
                {/*)}*/}
            </div>
        );
    }
}

export default Countdown;
