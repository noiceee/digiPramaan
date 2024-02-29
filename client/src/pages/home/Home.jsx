import DashInd from '../dashInd/DashInd';
import DashOrg from '../dashOrg/DashOrg';
import Landing from '../landing/Landing';
import './home.scss';

export default function Home({ user }) {
    console.log("From Landing")
    const renderHome = () => {
        switch (user) {
            case null:
                return (
                    <Landing />
                );
            case 'INDIVIDUAL':
                return (
                    <DashInd />
                );
            case 'ORGANIZATION':
                return (
                    <DashOrg />
                );
            default:
                return null;
        }
    };
    return (
        <>
            {renderHome()}
        </>
    )
}