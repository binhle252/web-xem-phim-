import '../../styles/Home.css';
import PendingMovies from '../../components/PendingMovies';

function Home(){
    return(
        <div>
            <div className="content">
            <PendingMovies></PendingMovies>
            </div>
        </div>
    );
};
export default Home;