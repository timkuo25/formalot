import '../css/Explore.css'
import { Card } from './Components/Card';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { useEffect, useState } from 'react';

const Explore = ( ) => {
    const [showTag, setShowTag] = useState('最新');
    const [loading, setLoading] = useState(true);
    const tags = ['最新', '熱門', '食物', '飲料', '美妝', '文具', '現金', '禮卷', '其他'];

    const [showList, setShowList] = useState({
        '最新': [],
        '熱門': [],
        '食物': [],
        '飲料': [],
        '美妝': [],
        '文具': [],
        '現金': [],
        '禮卷': [],
        '其他': [],
    })

    useEffect(() => {
        const fetchData = async () => {
            tags.forEach(async item => {
                const data = await fetch(`http://127.0.0.1:5000/GetFormByKeyWord?KeywordType=tag&Keyword=${item}類`);
                const dataJSON = await data.json();
                setShowList(prevShowList => {
                    let curShowList = prevShowList;
                    curShowList[item] = dataJSON;
                    return curShowList;
                });
            })
            console.log(showList);
        }
        fetchData();
    }, []);

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
                            }}
                        >{item}</div>
                    )
                })}
            </div>
            <section className='explore'>
                <div className='card-container'>
                    {showList[showTag].map(item => {
                        return <Card type='explore' info={item}/>
                    })}
                </div>
            </section>
            <Footer />
        </>
    )
}

export { Explore };