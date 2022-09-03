import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import useSpotify from "../hooks/useSpotify";
import {useRecoilState,useRecoilValue} from 'recoil'
import {playlistIdState, playlistState} from '../atoms/playlistAtom'
import Songs from '../components/Songs'
const colors=[
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
]
function Center() {
    const {data:session}=useSession();
    const spotifyApi=useSpotify()
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [color, setColor] = useState(null);
    useEffect(()=>{
        setColor(shuffle(colors).pop())
    },[playlistId]);
        useEffect(()=>{
            spotifyApi.getPlaylist(playlistId).then((data)=>{
                setPlaylist(data.body)
            }).catch((err)=>console.log("Something went wrong",err))
        },[spotifyApi,playlistId])
        console.log(playlist);
    return (
        <div className='flex-grow '>
            <h1></h1>
            <header className="absolute right-8 top-5">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">
                    <img className="rounded-full w-10 h-10" src={session?.user.image} alt=""/>
                    <h2 className="text-white">{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5 text-white"/>
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 `}>
                <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url}/>
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-100xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>
            <div>
                <Songs/>
            </div>
        </div>
)
}
export default Center;
