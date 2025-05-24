import '../../styles/Home.css';
import ApprovedMovies from '../../components/ApprovedMovies';

function Home(){
    return(
        <div>
            <div className="content">
            <ApprovedMovies></ApprovedMovies>
            </div>
        </div>
    );
};
export default Home;