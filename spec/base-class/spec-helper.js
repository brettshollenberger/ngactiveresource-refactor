var Mocks, BaseClass, Post, Mime, $httpBackend, $http;
beforeEach(module('BaseClass'));
beforeEach(module('Mocks'));
beforeEach(inject(function(_BaseClass_, _Mocks_, _BCMime_, _$httpBackend_, 
  _$http_) {

  BaseClass    = _BaseClass_;
  Mocks        = _Mocks_;
  Post         = Mocks.Post;
  Mime         = _BCMime_;
  $httpBackend = _$httpBackend_;
  $http        = _$http_;

}));
