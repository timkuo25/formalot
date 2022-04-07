import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';

const SurveyManagement = () => {
    
    return (
        <>
            <Navbar />
                <section className='survey-bar'>
                    <div className='survey-container'>
                        <h2 className='manage-header'>問卷管理</h2>
                        <div className='survey-card'>
                            <h3 className='manage-header'>&#10004;  已填寫問卷</h3>
                                <div className='card-container'>
                                    <Card/>
                                    <Card/>
                                    <Card/>
                                    <Card/>
                                </div>
                        </div>
                        <div className='survey-card'>
                            <h3 className='manage-header'>&#10004;  已發佈問卷</h3>
                                <div className='card-container'>
                                    <Card/>
                                    <Card/>
                                    <Card/>
                                    <Card/>
                                </div>
                        </div>
                        <div className='survey-manage-buttons'>
                            <button class='form-button'> 填答問卷</button>
                            <button class='form-button'> 製作問卷</button>
                        </div>
                    </div>
                </section>
        </>
    )
}

export { SurveyManagement }