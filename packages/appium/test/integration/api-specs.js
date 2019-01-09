// transpile:mocha
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import _ from 'lodash';
import sinon from 'sinon';
import API from '../../lib/api';

chai.use(chaiAsPromised);

const should = chai.should();

describe('api', function () {

  describe('.install', function () {
    let api;
    before(async function () {
      api = new API();
      await api.clean();
    });
    describe('from registry', function () {
      it('should not install if not in registry', async function () {
        await api.install('notrealdriver').should.be.rejectedWith(/Could not find driver/);
        await api.install('notrealdriver@1.0.1').should.be.rejectedWith(/Could not find driver/);
      });
      it('should install supported drivers', async function () {
        const res = await api.install('xcuitest');
        should.not.exist(res.source);
        res.packageName.should.equal('appium-xcuitest-driver');
        res.version.should.exist;
      });
      it('should install supported drivers by specific versions', async function () {
        const res = await api.install('xcuitest@2.104.0');
        should.not.exist(res.source);
        res.packageName.should.equal('appium-xcuitest-driver');
        res.version.should.equal('2.104.0');
      });
      it('should not install supported drivers with incorrect versions', async function () {
        await api.install('xcuitest@1.1000000.100000').should.be.rejectedWith(/No such version /);
      });
    });
  });
});