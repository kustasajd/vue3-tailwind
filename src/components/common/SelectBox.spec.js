import { shallowMount } from '@vue/test-utils'
import SelectBox from './SelectBox.vue'

describe('SelectBox', () => {

  const wrapper = shallowMount(SelectBox)

  it('SelectBox', async () => {
    
    wrapper.vm.selectedValue = 1;
    wrapper.vm.selectedV = wrapper.vm.selectedValue
    const e  = {
      target: {
        value: 3
      }
    }
    wrapper.vm.onSelect(e);
    
  })
})
