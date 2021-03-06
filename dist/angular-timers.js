(function() {
    'use strict';

    var tmrsvc = (window.tmrsvc = window.tmrsvc || {});

    tmrsvc.DelayTimer = function(delayMilliseconds) {
        var delay  = delayMilliseconds, running = false, handle;
        this.start = function(code) {
            if(this.isRunning())
            {
                throw new Error('Cannot start a timer that is already running.');
            }

            if(!code || typeof code !== 'function') {
                throw new Error('A valid function to execute is required by start.');
            }
            running = true;
            var additionArgs = getAdditionArgs(arguments);
            handle = setTimeout(function() {
                code.apply(null, additionArgs);
                running = false;
            }, delay)
        }

        this.getDelay = function() {
            return delay || 0;
        }

        this.setDelay = function(delayMilliseconds) {
            delay = delayMilliseconds;
        }

        this.isRunning = function() {
            return running;
        }

        this.cancel = function() {
            if(!this.isRunning())
            {
                return false;
            }
            clearTimeout(handle);
            return true;
        }
    }

    tmrsvc.RepeatingTimer = function(intervalMilliseconds) {
        var interval = intervalMilliseconds, running = false, handle;
        this.start = function(code){
            if(this.isRunning())
            {
                throw new Error('Cannot start a timer that is already running.');
            }

            if(!code || typeof code !== 'function') {
                throw new Error('A valid function to execute is required by start.');
            }
            running = true;
            var additionArgs = getAdditionArgs(arguments);
            handle = setInterval(function() {
                code.apply(null, additionArgs);
                running = false;
            }, interval)
        }

        this.stop = function(){
            if(!this.isRunning())
            {
                return false;
            }
            clearInterval(handle);
            return true;
        }

        this.isRunning = function(){
            return running;
        }

        this.getInterval = function(){
            return interval || 0;
        }

        this.setInterval = function(intervalMilliseconds){
            interval = intervalMilliseconds;
        }
    }

    tmrsvc.TimerService = function() {
        this.createDelayTimer = function(delayMilliseconds) {
            if(delayMilliseconds && typeof delayMilliseconds !== 'number') {
                throw new Error('TimerService.createDelayTimer requires a valid delay in milliseconds');
            }

            return new tmrsvc.DelayTimer(delayMilliseconds);
        };

        this.createRepeatingTimer = function(intervalMilliseconds) {
            if(intervalMilliseconds && typeof intervalMilliseconds !== 'number') {
                throw new Error('TimerService.createRepeatingTimer requires a valid interval in milliseconds');
            }

            return new tmrsvc.RepeatingTimer(intervalMilliseconds);
        };
    }

    function getAdditionArgs(args)
    {
        var result = [];
        if(args.length > 1) {
            for(var i = 1; i < args.length; i++) {
                result.push(args[i]);
            }
        }
        return result;
    }

    if(typeof angular !== 'undefined') {
        angular.module('angular-timers', []).service('timerService', [tmrsvc.TimerService]);
    }
})();
