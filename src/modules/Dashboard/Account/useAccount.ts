import { useState } from 'react';

import { UseAccount } from './Account.types';

const useAccount = (): UseAccount => {
  const [selectedTab, setSelectedTab] = useState<string>('1');
  const states = {
    selectedTab,
    setSelectedTab,
  };

  return {
    ...states,
  };
};

export default useAccount;