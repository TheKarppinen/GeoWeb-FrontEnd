import React from 'react';
import { default as ProgtempManagementPanel } from './ProgtempManagementPanel';
import { mount } from 'enzyme';

describe('(Component) ProgtempManagementPanel', () => {
  let _component;
  beforeEach(() => {
    _component = mount(<ProgtempManagementPanel urls={{ BACKEND_SERVER_URL: 'http://localhost:8080' }} />);
  });

  it('Renders a ProgtempManagementPanel', () => {
    expect(_component.type()).to.eql(ProgtempManagementPanel);
  });
});
