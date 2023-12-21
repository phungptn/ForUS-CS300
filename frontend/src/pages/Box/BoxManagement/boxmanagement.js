import { DeleteBoxButton } from "../AdminControl/admincontrol";
import { ChangeBoxDescriptionButton, RenameBoxButton } from "../ModeratorControl/moderatorcontrol";
import { useContext } from "react";
import { BoxContext } from "../context";

export function BoxControl() {
    const { moderatorStatus } = useContext(BoxContext);
    if (moderatorStatus === 'user') {
        return (null);
    }
    return (
        <div className="card-footer row m-0 p-0 justify-content-center rounded-bottom-2 overflow-hidden">
            <RenameBoxButton />
            <ChangeBoxDescriptionButton />
            <DeleteBoxButton />
        </div>
    );
}