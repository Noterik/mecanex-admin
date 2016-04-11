"use strict";angular.module("mecanexAdminApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.router","ui.bootstrap","underscore","angular.filter","forerunnerdb","xml"]).config(["$stateProvider","$urlRouterProvider","USER_ROLES",function(a,b,c){b.otherwise("/login"),a.state("login",{"abstract":!0,views:{"":{templateUrl:"views/pages/login.html"}},data:{authorizedRoles:[c.all]}}).state("login.default",{url:"/login",views:{"":{templateUrl:"views/login.default.html"}},data:{authorizedRoles:[c.all]}}).state("login.not-allowed",{url:"/not-allowed",templateUrl:"views/pages/not-allowed.html",data:{authorizedRoles:[c.all]}}).state("login.logout",{url:"/logout",templateUrl:"views/pages/logged-out.html",data:{authorizedRoles:[c.all]}}).state("pages",{"abstract":!0,views:{"":{templateUrl:"views/pages/default.html"}},data:{authorizedRoles:[c.all]}}).state("pages.collections",{"abstract":!0,url:"/collections",views:{"":{templateUrl:"views/collections.html"}},authorizedRoles:[c.admin,c.user]}).state("pages.collections.default",{url:"",views:{"":{templateUrl:"views/collections.list.html",controller:"CollectionsListCtrl"},list:{templateUrl:"views/videos.list.html",controller:"VideosListCtrl"}},data:{authorizedRoles:[c.admin,c.user]}}).state("pages.collections.list",{url:"/:colId",views:{"":{templateUrl:"views/collections.list.html",controller:"CollectionsListCtrl"},list:{templateUrl:"views/videos.list.html",controller:"VideosListCtrl"}},data:{authorizedRoles:[c.admin,c.user]}})}]).run(["$rootScope","AUTH_EVENTS","AuthService","$state",function(a,b,c,d){a.$on("$stateChangeStart",function(e,f){var g=f.data.authorizedRoles;console.log(g),c.isAuthorized(g)?console.log("ITS AUTHORIZED!"):(e.preventDefault(),c.isAuthenticated()?(d.go("login.not-allowed"),a.$broadcast(b.notAuthorized)):(d.go("login.default"),a.$broadcast(b.notAuthenticated)))})}]),angular.module("mecanexAdminApp").factory("chance",["$window",function(a){return new a.Chance}]),angular.module("mecanexAdminApp").factory("Fsxml",["X2JS",function(a){return function(){function b(){return(new DOMParser).parseFromString("<fsxml><properties /></fsxml>","text/xml")}return{renderFromResource:function(a){var c=b();if(!a.toJSON)throw new Error("Object doesn't implement toJSON(), are you using a $resource?");var d=c.getElementsByTagName("properties")[0];for(var e in a.toJSON()){var f=c.createElement(e);f.textContent=a[e],d.appendChild(f)}return c},parseFromFsxml:function(b){var c=new a,d=c.xml_str2json(b);return console.log(d),d}}}}]),angular.module("mecanexAdminApp").constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized"}),angular.module("mecanexAdminApp").constant("USER_ROLES",{all:"*",admin:"admin",user:"user",editor:"editor",guest:"guest"}),angular.module("mecanexAdminApp").factory("AuthService",["$http","Session","_","chance","$q",function(a,b,c,d,e){var f={},g=[{username:"admin@mecanex.nl",smithersId:"test-admin",password:"admin123",role:"admin"},{username:"guest@mecanex.nl",smithersId:"test-guest",password:"guest123",role:"guest"},{username:"user@mecanex.nl",smithersId:"test-user",password:"user123",role:"user"},{username:"pieter@noterik.nl",smithersId:"pieter",password:"pieter123",role:"user"}];return f.login=function(a){console.log("CREDENTIALS",a);var f=c.find(g,function(b){return b.username===a.username&&b.password===a.password});return e(function(a,c){f?a(b.create(d.guid(),f.username,f.role,f.smithersId)):c()})},f.isAuthenticated=function(){return!!b.userId},f.isAuthorized=function(a){return angular.isArray(a)||(a=[a]),-1!==a.indexOf("*")?!0:(console.log(a.indexOf(b.userRole)),a.indexOf(b.userRole)>0?!0:!1)},f}]),angular.module("mecanexAdminApp").service("Session",function(){this.create=function(a,b,c,d){this.id=a,this.userId=b,this.userRole=c,this.smithersId=d},this.destroy=function(){this.id=null,this.userId=null,this.userRole=null,this.smithersId=null}}),angular.module("mecanexAdminApp").factory("SpringfieldResource",["Fsxml","$resource",function(a,b){return function(){return{create:function(c){return b(c,{id:"@_id"},{save:{method:"POST",transformRequest:function(b){var c=new a;return c.renderFromResource(b)},headers:{Accept:"text/xml","Content-Type":"text/xml;charset=utf-8"}},update:{method:"PUT",url:c+"/properties",transformRequest:function(b){var c=new a;return c.renderFromResource(b)},headers:{Accept:"text/xml","Content-Type":"text/xml;charset=utf-8"}},retrieve:{method:"GET",transformResponse:function(b){var c=new a;return c.parseFromFsxml(b)},headers:{Accept:"text/xml","Content-Type":"text/xml;charset=utf-8"}}})}}}}]),angular.module("mecanexAdminApp").factory("Users",["SpringfieldResource",function(a){var b=new a;return b.create("/users/:id")}]),angular.module("mecanexAdminApp").factory("RandomData",["chance","$q","$fdb","_",function(a,b,c,d){function e(){return{_id:a.guid(),name:a.sentence({words:a.integer({min:1,max:5})}),description:a.sentence({words:a.integer({min:30,max:100})}),img:"https://unsplash.it/320/180/?random&i="+a.integer({min:10,max:20})}}function f(){var b=a.integer({min:50,max:150}),c=a.n(e,b),f=a.guid();return c=d.map(c,function(a){return a.colId=f,a}),{collection:{_id:f,name:a.sentence({words:a.integer({min:1,max:5})}),img:"https://unsplash.it/320/180/?random&i="+a.integer({min:10,max:20}),description:a.paragraph(),amountVideos:c.length},videos:c}}function g(){return{name:a.sentence({words:a.integer({min:1,max:5})}),description:a.sentence({words:a.integer({min:30,max:100})}),img:"https://unsplash.it/320/180/?random&i="+a.integer({min:10,max:20})}}var h=a.integer({min:3,max:12}),i=a.integer({min:50,max:150}),j=c.db("Mecanex"),k=j.collection("random-collections"),l=j.collection("random-collection-videos"),m=j.collection("external-videos"),n=a.n(f,h),o=a.n(g,i);k.insert(d.map(n,function(a){return a.collection}));for(var p=[],q=d.map(n,function(a){return a.videos}),r=0;r<q.length;r++)p=p.concat(q[r]);return l.insert(p),m.insert(o),{queryCollections:function(a){a=a?a:{};var b=a.query?a.query:{},c=a.settings?a.settings:{page:1,limit:10},d=k.find(b,{$skip:c.page-1,$limit:c.limit});return{totalItems:d.$cursor.records,itemsPerPage:c.limit,page:c.page,items:d}},queryCollectionVideos:function(a){a=a?a:{};var b=a.query?a.query:{},c=a.settings?a.settings:{page:1,limit:10},d=l.find(b,{$page:c.page-1,$limit:c.limit});return{totalItems:d.$cursor.records,itemsPerPage:c.limit,page:c.page,items:d}},queryExternalVideos:function(a){a=a?a:{};var b=a.query?a.query:{},c=a.settings?a.settings:{page:1,limit:10},d=m.find(b,{$page:c.page-1,$limit:c.limit});return{totalItems:d.$cursor.records,itemsPerPage:c.limit,page:c.page,items:d}}}}]),angular.module("mecanexAdminApp").factory("ExternalVideos",["chance","$q","RandomData",function(a,b,c){return{query:function(a){return b(function(b){b(c.queryExternalVideos(a))})}}}]),angular.module("mecanexAdminApp").factory("ColVideos",["Collections","$q",function(a,b){return{query:function(c){return b(function(b){b(a.queryVideos(c))})}}}]),angular.module("mecanexAdminApp").factory("Collections",["chance","$q","$fdb","SpringfieldResource","_","Session",function(a,b,c,d,e,f){function g(){return b(function(a){i().then(function(b){h(b),a()})})}function h(b){var c=[],d=[];angular.forEach(b.fsxml.collection,function(b){var d=j(b.video,b._id);c.push({collection:{_id:b._id,name:b.properties.title,description:b.properties.description,amountVideos:d.length,img:"https://unsplash.it/320/180/?random&i="+a.integer({min:10,max:20})},videos:d})}),m.insert(e.map(c,function(a){return a.collection}));for(var f=e.map(c,function(a){return a.videos}),g=0;g<f.length;g++)d=d.concat(f[g]);n.insert(d)}function i(){return k.create("http://a1.noterik.com:8081/smithers2/domain/mecanex/user/"+o+"/collection").retrieve().$promise.then(function(a){return a})}function j(a,b){var c=[];return angular.isArray(a)?angular.forEach(a,function(a){c.push({_id:a._id,name:a.properties.TitleSet_TitleSetInEnglish_title,description:a.properties.summaryInEnglish,img:a.properties.screenshot,colId:b})}):c.push({_id:a._id,name:a.properties.TitleSet_TitleSetInEnglish_title,description:a.properties.summaryInEnglish,img:a.properties.screenshot,colId:b}),c}console.log("Collections resource!");var k=new d,l=c.db("Mecanex"),m=l.collection("collections"),n=l.collection("collection-videos"),o=f.smithersId,p=g();return{query:function(a){a=a?a:{};var c=a.query?a.query:{},d=a.settings?a.settings:{page:0,limit:10},e=b.defer();return p.then(function(){var a=m.find(c,{$skip:d.page,$limit:d.limit});e.resolve({totalItems:a.$cursor.records,itemsPerPage:d.limit,page:d.page,items:a})}),e.promise},queryVideos:function(a){a=a?a:{};var c=a.query?a.query:{},d=a.settings?a.settings:{page:1,limit:10},e=b.defer();return p.then(function(){var a=n.find(c,{$page:d.page-1,$limit:d.limit});e.resolve({totalItems:a.$cursor.records,itemsPerPage:d.limit,page:d.page,items:a})}),e.promise}}}]),angular.module("mecanexAdminApp").controller("ApplicationController",["$scope","USER_ROLES","AuthService",function(a,b,c){a.currentUser=null,a.userRoles=b,a.isAuthorized=c.isAuthorized,a.setCurrentUser=function(b){a.currentUser=b}}]),angular.module("mecanexAdminApp").controller("LoginController",["$scope","$rootScope","AUTH_EVENTS","AuthService","$state",function(a,b,c,d,e){a.loginFailed=!1,a.credentials={username:"",password:""},a.login=function(f,g){d.login(f).then(function(d){a.loginFailed=!1,b.$broadcast(c.loginSuccess),a.setCurrentUser(d),e.go(g)},function(){a.loginFailed=!0,b.$broadcast(c.loginFailed)})}}]),angular.module("mecanexAdminApp").controller("HeaderController",["$scope","Session","$log","$state",function(a,b,c,d){a.currentUser=b.userId,a.status={isopen:!1},a.toggled=function(a){c.log("Dropdown is now: ",a)},a.logout=function(){b.destroy(),d.go("login.logout")}}]),angular.module("mecanexAdminApp").controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("mecanexAdminApp").controller("AboutCtrl",["Users",function(a){var b=new a({id:"123",firstName:"david",lastName:"ammeraal"});b.$update({id:b.id}),this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("mecanexAdminApp").controller("CollectionsListCtrl",["$scope","$uibModal","Collections",function(a,b,c){a.cols=[],a.colsPerSlide=4,a.curSlide=0,a.find=function(){c.query().then(function(b){b.items.unshift(null),a.cols=b.items})},a.newCollectionDialog=function(){b.open({animation:!0,templateUrl:"views/new-collection-dialog.html",controller:"NewCollectionDialogCtrl"})},a.find()}]),angular.module("mecanexAdminApp").controller("VideosListCtrl",["$scope","$log","$stateParams","ColVideos","ExternalVideos",function(a,b,c,d,e){a.items=[],a.totalItems=0,a.currentPage=1,a.limit=10,a.maxPages=5,a.col=c.colId?c.colId:null;var f=a.col?d:e,g=a.col?{colId:a.col}:{};a.setPage=function(b){a.currentPage=b,f.query({query:g,settings:{page:a.currentPage,limit:a.limit}}).then(function(b){a.totalItems=b.totalItems,a.currentPage=b.page,a.items=b.items})},a.pageChanged=function(){a.setPage(a.currentPage)},a.actions=[{description:"Add to collection",icon:"plus"}],a.setPage(1)}]),angular.module("mecanexAdminApp").controller("NewCollectionDialogCtrl",["$scope","$uibModalInstance",function(a,b){a.ok=function(){b.close()},a.cancel=function(){b.close()}}]),angular.module("mecanexAdminApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/collection.html",'<div class="row"> <div class="navbar navbar-default"> <div class="col-sm-3"> <form class="navbar-form navbar-input-group" role="search"> <div class="form-group"> <input type="text" class="form-control" placeholder="Search"> </div> <button type="submit" class="btn btn-default"><i class="glyphicon glyphicon-search"></i></button> </form> </div> <div class="col-sm-6"> <form class="text-center navbar-form navbar-input-group paging" role="pagination"> <div class="form-group"> <uib-pagination max-size="maxPages" boundary-links="true" boundary-link-numbers="true" rotate="true" total-items="totalItems" ng-model="currentPage" class="pagination-sm" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" ng-change="pageChanged()"></uib-pagination> </div> </form> </div> <div class="col-sm-3"> </div> </div> </div>'),a.put("views/collections.html",'<div ui-view></div> <div ui-view="list"></div>'),a.put("views/collections.list.html",'<div class="row"> <div class="col-md-12 collections"> <div class="row"> <uib-carousel active="active" interval="myInterval" no-wrap="noWrapSlides"> <uib-slide ng-repeat="block in cols | chunkBy: 4 track by $index" index="$index"> <div class="collections-list"> <!-- The collections --> <div class="collection col-sm-3" ng-repeat="col in block"> <div ng-if="col != null" class="collection-content sixteen-nine"> <div class="content"> <div class="collection-label"> {{col.name}} </div> <div class="collection-thumb"> <a ui-sref="pages.collections.list({colId: col._id, slideIndex: $index})"> <img ng-src="{{col.img}}" class="fill img-responsive" alt="{{col.amountVideos}}"> </a> </div> <div class="collection-counter"> <span class="badge">{{col.amountVideos}}</span> </div> </div> </div> <div ng-if="col == null" class="collection-content sixteen-nine"> <div class="content"> <div class="collection-thumb"> <button class="btn btn-default round-icon-button" ng-click="newCollectionDialog()"> <span class="glyphicon glyphicon-plus"></span> </button> </div> </div> </div> </div> </div> </uib-slide> </uib-carousel> </div> </div> </div>'),a.put("views/elements/header.html",'<div class="header" ng-controller="HeaderController"> <div class="navbar navbar-default" role="navigation"> <div class="container-fluid"> <div class="navbar-header"> <a class="navbar-brand" href="#/">MecanexAdmin</a> </div> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav navbar-right"> <li class="dropdown" uib-dropdown on-toggle="toggled(open)"> <a href class="dropdown-toggle" uib-dropdown-toggle>Welcome {{currentUser}} <span class="caret"></span></a> <ul class="dropdown-menu" uib-dropdown-menu> <li><a href ng-click="logout()">Log out</a></li> </ul> </li> </ul> </div> </div> </div> </div>'),a.put("views/login.default.html",'<div class="login-dialog"> <div class="login-dialog-header"> </div> <div class="container-fluid login-contents"> <div class="row"> <div class="col-md-1"> </div> <div class="col-md-10"> <div class="row title"> <div class="col-md-12"> <h1>Login</h1> </div> </div> <form ng-controller="LoginController" ng-submit="login(credentials, \'pages.collections.default\')" novalidate> <div class="row form"> <div class="col-md-12"> <div class="form-group" ng-class="{\'has-warning\': loginFailed}"> <input type="email" class="form-control" ng-model="credentials.username" id="UserEmail" placeholder="User e-mail address"> <br> <input type="password" class="form-control" ng-model="credentials.password" id="UserPassword" placeholder="Password"> <span ng-show="loginFailed" id="helpBlock" class="help-block">Incorrect email or password!</span> </div> </div> </div> <div class="row bottom"> <div class="col-md-9"> <div class="row"> <div class="col-md-12"> <div class="checkbox"> <label> <input type="checkbox">Keep me signed in </label> </div> </div> </div> <div class="row"> <div class="col-md-12"> <p>New to Mecanex? <b><a href="create">Create account</a></b></p> </div> </div> </div> <div class="col-md-3"> <button type="submit" class="btn btn-default">Sign in</button> </div> </div> </form> </div> <div class="col-md-1"> </div> </div> </div> </div>'),a.put("views/main.html",'<div class="jumbotron"> <h1>\'Allo, \'Allo!</h1> <p class="lead"> <img src="images/yeoman.8cb970fb.png" alt="I\'m Yeoman"><br> Always a pleasure scaffolding your apps. </p> <p><a class="btn btn-lg btn-success" ng-href="#/">Splendid!<span class="glyphicon glyphicon-ok"></span></a></p> </div> <div class="row marketing"> <h4>HTML5 Boilerplate</h4> <p> HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites. </p> <h4>Angular</h4> <p> AngularJS is a toolset for building the framework most suited to your application development. </p> <h4>Karma</h4> <p>Spectacular Test Runner for JavaScript.</p> </div>'),a.put("views/new-collection-dialog.html",'<div class="modal-header"> <h3 class="modal-title">New Collection</h3> </div> <div class="modal-body"> Placeholder for new collection form! </div> <div class="modal-footer"> <button class="btn btn-primary" type="button" ng-click="ok()">OK</button> <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button> </div>'),a.put("views/pages/default.html",'<!-- Add your site or application content here --> <div ng-include src="\'views/elements/header.html\'"></div> <div class="container-fluid"> <div ui-view></div> </div> <div class="footer"> <div class="container"> <p><span class="glyphicon glyphicon-copyright-mark"></span> by Noterik B.V.</p> </div> </div>'),a.put("views/pages/logged-out.html",'<span style="color: white">You are now logged out. Click <a ui-sref="login.default">here</a> to log back in.</span>'),a.put("views/pages/login.html",'<!-- Add your site or application content here --> <div class="container-fluid login"> <div ui-view></div> </div>'),a.put("views/pages/not-allowed.html",'<span style="color: white">You\'re not allowed to visit this page!</span>'),a.put("views/videos.list.html",'<section class="videos"> <div class="row"> <div class="navbar navbar-default"> <div class="col-sm-3"> <form class="navbar-form navbar-input-group" role="search"> <div class="form-group"> <div class="input-group search"> <input type="text" class="form-control" placeholder="Search"> <div class="input-group-addon"><i class="glyphicon glyphicon-search"></i></div> </div> </div> </form> </div> <div class="col-sm-6"> <form class="text-center navbar-form navbar-input-group paging" role="pagination"> <div class="form-group"> <uib-pagination max-size="maxPages" boundary-links="true" boundary-link-numbers="true" rotate="true" total-items="totalItems" ng-model="currentPage" class="pagination-sm" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" ng-change="pageChanged()"></uib-pagination> </div> </form> </div> <div class="col-sm-3"> </div> </div> </div> <div class="row"> <div class="videos-list col-sm-12"> <div class="video row" ng-repeat="video in items"> <div class="container-fluid"> <div class="col-sm-12"> <div class="row"> <div class="video-thumb"> <img class="fill image-responsive" ng-src="{{video.img}}" alt="{{video.name}}"> </div> <div class="video-information"> <div class="row fill-height"> <div class="col-sm-8"> <div class="video-descriptions"> <h3>{{video.name}}</h3> <span>{{video.description}}</span> </div> </div> <div class="col-sm-4 fill-height"> <div class="video-actions" ng-repeat="action in actions"> <button class="video-action btn btn-default round-icon-button"> <span class="glyphicon glyphicon-{{action.icon}}"></span> </button> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div class="navbar navbar-default"> <div class="col-sm-3"> </div> <div class="col-sm-6"> <form class="text-center navbar-form navbar-input-group paging" role="pagination"> <div class="form-group"> <uib-pagination max-size="maxPages" boundary-links="true" boundary-link-numbers="true" rotate="true" total-items="totalItems" ng-model="currentPage" class="pagination-sm" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" ng-change="pageChanged()"></uib-pagination> </div> </form> </div> <div class="col-sm-3"> </div> </div>  </section>')}]);