describe('TimerService', function () {
    var tmrsvc = (window.tmrsvc = window.tmrsvc || {});
    var arg, service;

    beforeEach(function () {
        substitute.throwErrors();
        arg = substitute.arg;
        service = new tmrsvc.TimerService();
    });

    it('Should be defined', function () {
        expect(service).toBeDefined();
    });

    it('Should define a method to create a timer for scheduling a task once', function () {
        expect(service.createDelayTimer).toBeDefined();
        expect(typeof service.createDelayTimer).toBe('function');
    });

    it('Should expect one argument for create delay', function () {
        expect(service.createDelayTimer.length).toBe(1);
    });

    it('Should throw error if argument is not a number', function () {
        expect(function(){
            service.createDelayTimer({});
        }).toThrowError('TimerService.createDelayTimer requires a valid delay in milliseconds');
    });

    it('Should return instance of DelayTimer on createDelayTimer', function() {
        var timer = service.createDelayTimer();
        expect(timer instanceof tmrsvc.DelayTimer);
    });

    it('Should define a method to create a timer for scheduling a task once', function () {
        expect(service.createRepeatingTimer).toBeDefined();
        expect(typeof service.createRepeatingTimer).toBe('function');
    });

    it('Should expect one argument for create delay', function () {
        expect(service.createRepeatingTimer.length).toBe(1);
    });

    it('Should throw error if argument is not a number', function () {
        expect(function(){
            service.createRepeatingTimer({});
        }).toThrowError('TimerService.createRepeatingTimer requires a valid interval in milliseconds');
    });

    it('Should return instance of RepeatingTimer on createRepeatingTimer', function() {
        var timer = service.createRepeatingTimer();
        expect(timer instanceof tmrsvc.RepeatingTimer);
    });
});
