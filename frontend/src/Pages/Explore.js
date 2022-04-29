import '../css/Explore.css'
import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { useState } from 'react';

const Explore = ( {tags} ) => {
    const [showTag, setShowTag] = useState('最新');

    const [latest, setLatest] = useState([]);
    const [popular, setPopular] = useState([]);
    const [food, setFood] = useState([]);
    const [drink, setDrink] = useState([]);
    const [cosmetic, setCosmetic] = useState([]);
    const [sta, setSta] = useState([]);
    const [cash, setCash] = useState([]);
    const [voucher, setVoucher] = useState([]);
    const [other, setOther] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await fetch('http://localhost:5000/GetFormByKeyWord?KeywordType=&Keyword=');
    //         const dataJSON = await data.json();
    //         console.log(dataJSON);
            
    //     }
    //     fetchData();
    // }, []);

    return (
        <>
            <Navbar />
            <div className='explore-title'>
                <h2>探索抽獎</h2>
            </div>
            <div className='tag-select'>
                {tags.map(item => {
                    return (
                        <div
                            className='tag-item'
                            key={item}
                            style={item === showTag ? {backgroundColor: 'rgba(77, 14, 179, 0.15)'} : {}}
                            onClick={e => {
                                setShowTag(item);
                                // if (item === '最新')
                            }}
                        >{item}</div>
                    )
                })}
            </div>
            <section className='explore'>
                <div className='card-container'>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
                <div className='card-container'>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
            </section>
            <Footer />
        </>
    )
}

Explore.defaultProps = {
    tags: ['最新', '熱門', '食物', '飲料', '美妝', '文具', '現金', '禮卷', '其他']
}

export { Explore };