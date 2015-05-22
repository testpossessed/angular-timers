(function(){

    var sch = (window.pcg = window.pcg || {});

    function SpecAssistant(){
        this.stubs = {
            $state: ['go'],
            $http: ['get', 'post'],
            $q: ['defer'],
            $deferred: {
                resolve: function(data){
                },
                reject: function(rejection){
                },
                promise: null
            },
            jQuery: ['on'],
            angular: ['element'],
            event: ['preventDefault'],
            $cookieStore: ['get', 'put', 'remove']
        };
        this.createAngularCookieStoreSub = function()
        {
            return substitute.for(this.stubs.$cookieStore);
        }
        this.createScope = function(){
            return {
                $apply: function(action){
                    if(action){
                        action();
                    }
                },
                $on: function(eventName, handler){}
            };
        };
        this.createAngularForm = function(){
            var form = substitute.for({
                $invalid: false,
                $setSubmitted: function(){
                    this.$submitted = true;
                },
                $submitted: false
            });
            form.callsThrough('$setSubmitted');
            return form;
        };
        this.createAngularFormField = function(){
            var field = substitute.for({
                $setDirty: function(){
                    this.$dirty = true;
                },
                $dirty: false
            });;
            field.callsThrough('$setDirty');
            return field;
        };
        this.initialiseAngularSubstitute = function(){
            this.jq = substitute.for(this.stubs.jQuery);
            this.ng = substitute.for(this.stubs.angular);
            this.ng.returns('element', this.jq);
            window.angular = this.ng;
        };
        this.createAngularStateSub = function(){
            var sub = substitute.for(this.stubs.$state);
            sub.current = {
                parent: 'parent.state'
            };
            return sub;
        };
        this.createDeferredSub = function(){
            var sub = substitute.for(this.stubs.$deferred);
            sub.promise = substitute.forPromise();
            return sub;
        };
        this.createQSub = function(deferred){
            var sub = substitute.for(this.stubs.$q);
            var deferredSub = deferred || this.createDeferredSub();
            sub.returns('defer', deferredSub);
            return sub;
        };
        this.createAngularHttpSub = function(){
            return substitute.for(this.stubs.$http);
        };
    };

    window.specAssistant = new SpecAssistant();
})();