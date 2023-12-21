import { DeleteBoxButton } from "../AdminControl/admincontrol";

export function BoxControl({ box }) {
    return (
        <div class="card-footer row m-0 p-0 justify-content-center">
            <DeleteBoxButton box={box} />
        </div>
    );
}