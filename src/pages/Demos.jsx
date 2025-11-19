import { Link } from 'react-router-dom'

const IMG_BASE = 'https://tympanus.net/Development/3DCarousel/assets'

const scenes = [
  { id: 1, title: 'Haute Couture Nights — Paris', thumb: 1 },
  { id: 2, title: 'Vogue Evolution — New York City', thumb: 13 },
  { id: 3, title: 'Glamour in the Desert — Dubai', thumb: 25 },
  { id: 4, title: 'Chic Couture Runway — Milan', thumb: 37 },
  { id: 5, title: 'Style Showcase — London', thumb: 49 },
  { id: 6, title: 'Future Fashion Forward — Tokyo', thumb: 61 },
]

export default function Demos() {
  return (
    <main className="min-h-screen px-8 py-24">
      <h2 className="mb-8">All Demos</h2>
      <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {scenes.map((s) => (
          <Link key={s.id} to={`/#scene-${s.id}`} className="block">
            <div className="w-full aspect-[4/5] bg-center bg-cover rounded" style={{ backgroundImage: `url(${IMG_BASE}/img${s.thumb}.webp)` }} />
            <div className="mt-2 text-sm">{s.title}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
