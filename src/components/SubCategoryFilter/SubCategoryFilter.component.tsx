import { Props } from './SubCategoryFilter.types';

const SubCategoryFilter = (props: Props) => {
  const { subCategories, selectedSubCategoryIds, handleSelectSubCategory } = props;

  return (
    <div className='flex flex-wrap gap-2'>
      {subCategories.map(item => (
        <button
          key={item.subCategoryId}
          className={`${selectedSubCategoryIds.includes(item.subCategoryId) ? 'bg-primary-btn text-primary-white' : 'bg-primary-white text-primary-black'} text-sm font-medium px-2 py-1 border rounded-md text-nowrap`}
          onClick={() => handleSelectSubCategory(item.subCategoryId)}
        >
          {item.subCategoryName}
        </button>
      ))}
    </div>
  );
};

export default SubCategoryFilter;