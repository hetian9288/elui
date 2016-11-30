import { createTest, destroyVM } from '../util';
import Address from 'packages/address';

describe('Address', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Address, true);
    expect(vm.$el).to.exist;
  });
});

