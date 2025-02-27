import { Props } from './Tab.types';


const Tab = (props: Props) => {
  const { tabs, selectedTab, onSelectTab } = props;

  return (
    <div>
      <div className='flex overflow-scroll no-scroll-indicator gap-4 md:gap-5 xl:gap-6 border-b'>
        {tabs?.map(item => (
          <div
            key={item.key}
            className={`pb-3 ${selectedTab === item.key ? 'border-b-2 border-primary-btn' : ''}`}
          >
            <button
              className={`tab text-base text-nowrap font-semibold hover:cursor-pointer hover:text-primary-btn
                ${selectedTab === item.key ? 'text-primary-btn' : 'text-primary-gray'}`}
              onClick={() => onSelectTab(item.key)}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>
      <div className='mt-4 md:mt-8'>
        {tabs.find(item => item.key === selectedTab)?.component}
      </div>
    </div>
  );
};

export default Tab;