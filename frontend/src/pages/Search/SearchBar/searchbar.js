import { useState } from 'react';
import './searchbar.scss';
import { route } from '../route';

function SearchBarTypeDropdown({ type, setType }) {
    return (
        <div class="btn-group">
            <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {type}
            </button>
            <ul class='dropdown-menu dropdown-menu-end bg-light'>
                <li class="dropdown-item" onClick={() => setType('Thread')}>Thread</li>
                <li class="dropdown-item" onClick={() => setType('User')}>User</li>
                <li class="dropdown-item" onClick={() => setType('Box')}>Box</li>
            </ul>
        </div>
    );
}

export function SearchBar() {
    const [type, setType] = useState('Thread');
    return (
        <form class="bg-primary d-flex p-3 gap-3 rounded-4" onSubmit={async (e) => {
            e.preventDefault();
            const searchInput = document.getElementById("searchInput");
            const searchButton = document.getElementById("searchButton");
            const searchType = document.getElementById("searchType");
            const query = searchInput.value;
            if (query) {
                searchButton.disabled = true;
                searchInput.disabled = true;
                window.location.href = route(query, type.toLocaleLowerCase());
            }
        }}>
            <input class="form-control bg-light" type="search" placeholder="Search" aria-label="Search" id="searchInput"/>
            <SearchBarTypeDropdown type={type} setType={setType} />
            <button class="btn btn-info text-white text-nowrap" type="submit" title="Tìm kiếm" id="searchButton">
                <i class="bi bi-search"/> Tìm kiếm
            </button>
        </form>
    );
}