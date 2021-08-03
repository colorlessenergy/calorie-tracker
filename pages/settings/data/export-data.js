import SettingsNav from "../../../shared/components/SettingsNav";

export default function ExportData () {
    const exportData = () => {
        const foodBlocks = localStorage.getItem('foodBlocks');
        const previousFoodBlocks = localStorage.getItem('previousFoodBlocks');
        const data = {
            foodBlocks: foodBlocks,
            previousFoodBlocks: previousFoodBlocks
        }

        const filename = 'calorie-tracker-data.json';
        const JSONString = JSON.stringify(data);
        let anchorElement = document.createElement('a');
        anchorElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSONString));
        anchorElement.setAttribute('download', filename);
        anchorElement.style.display = 'none';
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
    }

    return (
        <div className="container">
            <SettingsNav />
            <div className="mx-15">
                <h1 className="mt-0">
                    export data 
                </h1>

                <p>
                    export food blocks and previous food blocks
                </p>

                <button
                    onClick={ exportData }
                    className="button button-green">export data</button>
            </div>
        </div>
    );
}