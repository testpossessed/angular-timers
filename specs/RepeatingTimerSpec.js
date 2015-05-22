describe('RepeatingTimer', function() {
    var tmrsvc = (window.tmrsvc = window.tmrsvc || {});
    var arg, timer;

    beforeEach(function() {
        substitute.throwErrors();
        arg   = substitute.arg;
        timer = new tmrsvc.RepeatingTimer();
    });

    describe('Interface', function() {
        it('Should be defined', function() {
            expect(timer).toBeDefined();
        });

        it('Should define a method to start the timer', function() {
            expect(timer.start).toBeDefined();
            expect(typeof timer.start).toBe('function');
        });

        it('Should expect at least one argument for the function to repeat', function() {
            expect(timer.start.length).toBe(1);
        });

        it('Should define a method to query the interval', function() {
            expect(timer.getInterval).toBeDefined();
            expect(typeof timer.getInterval).toBe('function');
        });

        it('Should define a method to set the interval', function() {
            expect(timer.setInterval).toBeDefined();
            expect(typeof timer.setInterval).toBe('function');
        });

        it('Should expect at least one argument for the new interval', function() {
            expect(timer.setInterval.length).toBe(1);
        });

        it('Should define a method to query whether the timer is running', function() {
            expect(timer.isRunning).toBeDefined();
            expect(typeof timer.isRunning).toBe('function');
        });

        it('Should define a method to stop a running timer', function() {
            expect(timer.stop).toBeDefined();
            expect(typeof timer.stop).toBe('function');
        });
    });

    describe('Query and Set Interval', function() {
        it('Should report zero if interval not set via constructor', function() {
            expect(timer.getInterval()).toBe(0);
        });

        it('Should report interval set via constructor', function() {
            var timer = new tmrsvc.RepeatingTimer(500);
            expect(timer.getInterval()).toBe(500);
        });

        it('Should report interval set via method', function() {
            var timer = new tmrsvc.RepeatingTimer(500);
            timer.setInterval(1000);
            expect(timer.getInterval()).toBe(1000);
        });
    })

    describe('Running', function() {
        it('Should throw an error if a function to run is not specified on start', function() {
            expect(function() {
                timer.start();
            }).toThrowError('A valid function to execute is required by start.')
        });

        it('Should throw an error if start is attempted with argument that is not a function', function() {
            expect(function() {
                timer.start({});
            }).toThrowError('A valid function to execute is required by start.')
        });

        it('Should throw an error on attempt to start a running timer', function() {
            var timer = new tmrsvc.DelayTimer(2000);
            timer.start(function(){});
            expect(function(){
                timer.start(function(){});
            }).toThrowError('Cannot start a timer that is already running.');
        });

        it('Should report the timer is running when possible', function() {
            timer.setInterval(2000);
            timer.start(function() {
            });
            expect(timer.isRunning()).toBeTruthy();
            timer.stop();
        });

        it('Should execute function for the first time almost immediately if no interval specified', function(done) {
            var start = (new Date()).valueOf(), end, timer = new tmrsvc.RepeatingTimer();
            timer.start(function() {
                if(!end) {
                    end = (new Date()).valueOf();
                }
            });
            setTimeout(function() {
                timer.stop();
                done();
                expect(end).toBeDefined();
                expect(end - start).toBeLessThan(15);  // takes this long to setup and run
                expect(timer.isRunning()).toBeFalsy();
            }, 200)
        });

        it('Should execute function for first time on or after specified interval', function(done) {
            var start = (new Date()).valueOf(), end, timer = new tmrsvc.RepeatingTimer();
            timer.setInterval(500);
            timer.start(function() {
                if(!end) {
                    end = (new Date()).valueOf();
                }
            });
            setTimeout(function() {
                timer.stop();
                done();
                expect(end).toBeDefined();
                expect(end - start).toBeGreaterThan(499);
                expect(timer.isRunning()).toBeFalsy();
            }, 1000)
        });

        it('Should pass through any additional arguments', function(done) {
            var arg1 = '', arg2 = '', timer = new tmrsvc.RepeatingTimer();
            timer.start(function(a1, a2) {
                if(!arg1) {
                    arg1 = a1;
                    arg2 = a2;
                }
            }, 'arg1', 'arg2');
            setTimeout(function() {
                done();
                timer.stop();
                expect(arg1).toBe('arg1');
                expect(arg2).toBe('arg2');
            });
        });

        it('Should execute function multiple times', function(done) {
            var executeCount = 0, timer = new tmrsvc.RepeatingTimer(500);
            timer.start(function() {
                executeCount++;
            });
            setTimeout(function() {
                done();
                timer.stop();
                expect(executeCount).toBeGreaterThan(1);
            }, 2000)
        });
    })

    describe('Cancelling', function() {
        it('Should return false if timer not running on attempt to stop', function() {
            expect(timer.stop()).toBeDefined();
            expect(timer.stop()).toBeFalsy();
        });

        it('Should return true if the timer was running on attempt to stop', function() {
            var timer = new tmrsvc.RepeatingTimer(1000);
            timer.start(function() {
            });
            expect(timer.stop()).toBeTruthy();
        });

        it('Should not execute function if stop attempted before interval expires', function(done) {
            var wasExecuted = false, timer = new tmrsvc.RepeatingTimer(1500);
            timer.start(function() {
                wasExecuted = true;
            });
            timer.stop();
            setTimeout(function() {
                done();
                expect(wasExecuted).toBe(false);
            }, 2000);
        });

        it('Should stop executing function after stop', function(done) {
            var executeCount = 0, timer = new tmrsvc.RepeatingTimer(500);
            timer.start(function() {
                executeCount++;
                if(executeCount === 3) {
                    timer.stop();
                }
            });
            setTimeout(function() {
                done();
                expect(executeCount).toBeGreaterThan(2);
                expect(executeCount).toBeLessThan(5);
            }, 2000);
        });
    });
});
