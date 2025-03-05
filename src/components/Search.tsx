type Props = {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Search: React.FC<Props> = ({ searchTerm, handleSearchChange }) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 pl-10 bg-gray-50 border-0 rounded-lg focus:ring-0 focus:outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
      </div>
    </div>
  );
};

export default Search;
