export interface Props {
    onChange: (arg?:any) => void | any;
}

export default function SearchBar({onChange} : Props) {

    return (
        <div className="search-bar-container">
            <input
                type="search"
                placeholder="Search"
                onChange={(e) => onChange(e.target.value)}
            >
            </input>
            <button>Filter</button>
        </div>
    );
}