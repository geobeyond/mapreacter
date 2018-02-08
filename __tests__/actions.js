
import * as mapActions from '../src/actions/map'

describe('#setConfig', () => {
  it('returns SET_CONFIG action', () => {
    let config = { test: 1 };
    let expected = {
      type: 'SET_CONFIG',
      config
    };
    expect(mapActions.setConfig(config)).toEqual(expected)
  })
});
