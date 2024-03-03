import DashInd from '../dashInd/DashInd';
import DashOrg from '../dashOrg/DashOrg';
import Landing from '../landing/Landing';
import './home.scss';

export default function Home({ user, setUser }) {
    const renderHome = () => {
        switch (user?.type) {
            case 'INDIVIDUAL':
                return (
                    <DashInd user={user}/>
                );
            case 'ORGANIZATION':
                return (
                    <DashOrg user={user}/>
                );
            default:
                return (
                    <Landing setUser={setUser}/>
                );
        }
    };
    return (
        <>
            {renderHome()}
        </>
    )
}