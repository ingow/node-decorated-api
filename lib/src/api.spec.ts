import { Api } from './api';
import { Controller } from './decorators/api/controller.decorator';

@Controller('/test')
class TestController {}

describe('Api', () => {
  it('should add classes', () => {
    const spy = jest.spyOn(Api, 'add');
    const clazz = [TestController];
    Api.add(clazz);
    expect(spy).toHaveBeenCalledWith(clazz);
  });
});
