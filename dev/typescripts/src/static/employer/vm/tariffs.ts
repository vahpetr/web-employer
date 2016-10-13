import * as ko from "knockout";

import Base = require("common/vm");
// import da = require("da/tariffs");

class Tariffs extends Base {
  constructor(params: any) {
      let config = ko.utils.extend({}, params);
      super(config, {});//da
  }
}

export = Tariffs;