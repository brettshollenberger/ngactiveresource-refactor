describe("Mime", function() {
  describe("Adding Formats", function() {
    beforeEach(function() {
      new Mime.Format({name: "json"});
    });

    it("adds new core formats", function() {
      expect(Mime.formats.json).toBeDefined();
    });
  });

  describe("Adding MimeTypes", function() {
    describe("Top-Level Name, Tree, Subtype Name, Suffix Format", function() {
      beforeEach(function() {
        new Mime.Type({name: "application/json"});
        new Mime.Type({name: "application/atom+xml"});
        new Mime.Type({name: "application/vnd.ms-excel"});
      });

      it("adds new mime types", function() {
        expect(Mime.types["application/json"]).toBeDefined();
        expect(Mime.types["application/atom+xml"]).toBeDefined();
        expect(Mime.types["application/vnd.ms-excel"]).toBeDefined();
      });

      it("parses a mime type's Top-Level Name", function() {
        expect(Mime.types["application/json"].topLevelName).toEqual("application");
        expect(Mime.types["application/atom+xml"].topLevelName).toEqual("application");
        expect(Mime.types["application/vnd.ms-excel"].topLevelName).toEqual("application");
      });

      it("parses a mime types's subtype name", function() {
        expect(Mime.types["application/json"].subtypeName).toEqual("json");
        expect(Mime.types["application/atom+xml"].subtypeName).toEqual("atom");
        expect(Mime.types["application/vnd.ms-excel"].subtypeName).toEqual("ms-excel");
      });

      it("parses a mime type's tree", function() {
        expect(Mime.types["application/json"].tree).toEqual("standards");
        expect(Mime.types["application/atom+xml"].tree).toEqual("standards");
        expect(Mime.types["application/vnd.ms-excel"].tree).toEqual("vnd");
      });

      it("parses a mime type's suffix", function() {
        expect(Mime.types["application/json"].suffix).toEqual(undefined);
        expect(Mime.types["application/atom+xml"].suffix).toEqual("xml");
        expect(Mime.types["application/vnd.ms-excel"].suffix).toEqual(undefined);
      });

      it("throws an error if defining a duplicate mimetype", function() {
        expect(function() { new Mime.Type({name: "application/json"}) }).toThrow();
      });
    });
  });

  describe("finding by mimetype", function() {
    beforeEach(function() {
      new Mime.Type({name: "application/json"});
    });

    it("finds registered mimetypes", function() {
      var mimetype = Mime.types.find("application/json");
      expect(mimetype.name).toEqual("application/json");
    });
  });

  describe("Parsers", function() {
    function jsonParser(rawJson) {
      return rawJson;
    };

    beforeEach(function() {
      new Mime.Type({name: "application/json"});
      Mime.types["application/json"].parsers.push(jsonParser);
    });

    describe("Adding", function() {
      describe("#push", function() {
        it("adds parsers to existing mime types", function() {
          expect(Mime.types["application/json"].parsers).toContain(jsonParser);
        });

        it("throws if parser is not a function", function() {
          var notAFunction = {};
          expect(function() { Mime.types["application/json"].parsers.push(notAFunction); })
            .toThrow();
        });
      });

      describe("#unshift", function() {
        it("adds parsers to existing mime types", function() {
          function goodParser() {};
          Mime.types["application/json"].parsers.unshift(goodParser);
          expect(Mime.types["application/json"].parsers).toContain(goodParser);
        });

        it("throws if parser is not a function", function() {
          var notAFunction = {};
          expect(function() { Mime.types["application/json"].parsers.unshift(notAFunction); })
            .toThrow();
        });
      });
    });

    describe("Removal", function() {
      it("removes parsers from existing mime types", function() {
        Mime.types["application/json"].parsers.remove(jsonParser);
        expect(Mime.types["application/json"].parsers).not.toContain(jsonParser);
      });

      it("removes parsers given their string name", function() {
        Mime.types["application/json"].parsers.remove("jsonParser");
        expect(Mime.types["application/json"].parsers).not.toContain(jsonParser);
      });

      it("removes all parsers", function() {
        Mime.types["application/json"].parsers.removeAll();
        expect(Mime.types["application/json"].parsers.length).toBe(0);
      });
    });
  });

  describe("Parsing", function() {
    describe("a new mimetype", function() {
      var proprietaryStandard;
      beforeEach(function() {
        new Mime.Type({name: "proprietary/standard"});

      function proprietaryStandardParser(data) {
        return {
          post: {
            postId: 1,
            title: "My Great Post"
          }
        };
      };

      Mime.types["proprietary/standard"].parsers.push(proprietaryStandardParser);

      proprietaryStandard = "<post> \
                               <postId>1</postId> \
                               <title>My Great Post</title> \
                             </post>";
      });

      it("transforms a mimetype according to its parsers", function() {
        expect(Mime.parse(
          {type: "proprietary/standard", data: proprietaryStandard}))
          .toEqual({post: {postId: 1, title: "My Great Post"}});
      });

      it("also has syntax for parsing via the MimeType instance", function() {
        expect(Mime.types["proprietary/standard"].parse(proprietaryStandard))
          .toEqual({post: {postId: 1, title: "My Great Post"}});

        expect(Mime.types["proprietary/standard"]
          .parse({data: proprietaryStandard}))
            .toEqual({post: {postId: 1, title: "My Great Post"}});
      });

      it("throws a ParseError if the parse chain does not return an object", 
        function() {

        Mime.types["proprietary/standard"].parsers.removeAll();

        expect(function() { 
          Mime.parse({type: "proprietary/standard", 
            data: proprietaryStandard})
        }).toThrow();
      });
    });
  });
});
