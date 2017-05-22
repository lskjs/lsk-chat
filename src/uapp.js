export default ctx => class LskChat {
  async init() {
    this.components = require('./uapp/components').default(ctx, this);
    // this.stores = require('./uapp/stores').default(ctx);
  }
};
