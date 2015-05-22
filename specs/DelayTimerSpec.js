describe('DelayTimer', function() {
    var tmrsvc = (window.tmrsvc = window.tmrsvc || {});
    var arg, timer;

    beforeEach(function() {
        substitute.throwErrors();
        arg   = substitute.arg;
        timer = new tmrsvc.DelayTimer();
    });

    describe('Interface', function() {
        it('Should be defined', function() {
            expect(timer).toBeDefined();
        });

        it('Should define a method to start the timer', function() {
            expect(timer.start).toBeDefined();
            expect(typeof timer.start).toBe('function');
        });

        it('Should expect at least one argument for the code to run on start', function() {
            expect(timer.start.length).toBe(1);
        });

        it('Should define a method to query the delay', function() {
            expect(timer.getDelay).toBeDefined();
            expect(typeof timer.getDelay).toBe('function');
        });

        it('Should define a method to set the delay', function() {
            expect(timer.setDelay).toBeDefined();
            expect(typeof timer.setDelay).toBe('function');
        });

        it('Should expect at least one argument for the new delay', function() {
            expect(timer.setDelay.length).toBe(1);
        });

        it('Should define a method to query whether the timer is running', function() {
            expect(timer.isRunning).toBeDefined();
            expect(typeof timer.isRunning).toBe('function');
        });

        it('Should define a method to cancel a running timer', function() {
            expect(timer.cancel).toBeDefined();
            expect(typeof timer.cancel).toBe('function');
        });
    });

    describe('Query and Set Delay', function() {
        it('Should report zero if delay not set via constructor', function() {
            expect(timer.getDelay()).toBe(0);
        });

        it('Should report delay set via constructor', function() {
            var timer = new tmrsvc.DelayTimer(500);
            expect(timer.getDelay()).toBe(500);
        });

        it('Should report delay set via method', function() {
            var timer = new tmrsvc.DelayTimer(500);
            timer.setDelay(1000);
            expect(timer.getDelay()).toBe(1000);
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
            timer.setDelay(2000);
            timer.start(function (){});
            expect(timer.isRunning()).toBeTruthy();
        });

        it('Should run code almost immediately if no delay specified', function(done) {
            var start = (new Date()).valueOf(), end, timer = new tmrsvc.DelayTimer();
            timer.start(function(){
                end = (new Date()).valueOf();
            });
            setTimeout(function(){
                done();
                expect(end).toBeDefined();
                expect(end - start).toBeLessThan(5);
                expect(timer.isRunning()).toBeFalsy();
            }, 200)
        });

        it('Should run code on or after specified delay', function(done) {
            var start = (new Date()).valueOf(), end, timer = new tmrsvc.DelayTimer();
            timer.setDelay(500);
            timer.start(function(){
                end = (new Date()).valueOf();
            });
            setTimeout(function(){
                done();
                expect(end).toBeDefined();
                expect(end - start).toBeGreaterThan(499);
                expect(timer.isRunning()).toBeFalsy();
            }, 1000)
        });

       it('Should pass through any additional arguments', function(done) {
            var arg1 = '', arg2 = '', timer = new tmrsvc.DelayTimer();
            timer.start(function (a1, a2){
                arg1 = a1;
                arg2 = a2;

            }, 'arg1', 'arg2');
            setTimeout(function() {
                done();
                expect(arg1).toBe('arg1');
                expect(arg2).toBe('arg2');
            });
        });
    })

    describe('Cancelling', function(){
        it('Should return false if timer not running on attempt to cancel', function() {
            expect(timer.cancel()).toBeDefined();
            expect(timer.cancel()).toBeFalsy();
        });

        it('Should return true if the timer was running on attempt to cancel', function() {
            var timer = new tmrsvc.DelayTimer(1000);
            timer.start(function(){});
            expect(timer.cancel()).toBeTruthy();
        });

        it('Should not run code if cancel attempted before delay expires', function(done) {
            var wasExecuted = false, timer = new tmrsvc.DelayTimer(1000);
            timer.start(function(){
                wasExecuted = true;
            });
            timer.cancel();
            setTimeout(function(){
                done();
                expect(wasExecuted).toBe(false);
            }, 2000);

        });
    });
});
