import { useNavigate } from "react-router-dom";

export function SearchBar() {
    const navigate = useNavigate();
    return (
        <form class="bg-primary d-flex p-3 gap-3 rounded-4" onSubmit={async (e) => {
            e.preventDefault();
            const searchInput = document.getElementById("searchInput");
            const searchButton = document.getElementById("searchButton");
            const query = searchInput.value;
            if (query) {
                searchButton.disabled = true;
                searchInput.disabled = true;
                window.location.href = `/search?q=${query}`;
            }
        }}>
            <input class="form-control bg-light" type="search" placeholder="Search" aria-label="Search" id="searchInput"/>
            <button class="btn btn-info text-white text-nowrap" type="submit" title="Tìm kiếm" id="searchButton">
                <i class="bi bi-search"/> Tìm kiếm
            </button>
        </form>
    );
}