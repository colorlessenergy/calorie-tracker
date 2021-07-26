import classes from './Snackbar.module.scss';

export default function Snackbar ({ message, className }) {
    return (
       <div className={`${ classes["snackbar"] } ${ className ? (classes[className]) : ("") } `}>
            { message }
        </div>
    );
}