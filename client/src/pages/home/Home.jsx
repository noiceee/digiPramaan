import DashInd from '../dashInd/DashInd';
import DashOrg from '../dashOrg/DashOrg';
import Landing from '../landing/Landing';
import './home.scss';

export default function Home({ user }) {
    console.log("From Landing")
    const renderHome = () => {
        switch (user.type) {
            case null:
                return (
                    <Landing />
                );
            case 'INDIVIDUAL':
                return (
                    <DashInd user={user}/>
                );
            case 'ORGANIZATION':
                return (
                    <DashOrg user={user}/>
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