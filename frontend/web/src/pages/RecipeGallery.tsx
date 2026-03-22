import { Link } from 'react-router-dom';

export default function RecipeGallery() {
  const recipes = [
    { id: 1, title: "Truffle Infused Wild Mushroom Risotto", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2yPz_8QvYvL4r4_Q94wT8192r_6KzW8lXJ062qY6Z0P6N-2_O8lY7wX94U4P_97-T_w4v4_RzT0L0K-_0U186M9pX0uW-R90yT2z_xO72-005wQ5h94O84z1x0s-9Q9K8pT3Z2Z9X64X7wZ0Y_S2wT2n8z9m5Q793R73w2T_S_l5X_8M_F_8C_12xT0_8I2wUqP-R" },
    { id: 2, title: "Summer Citrus Quinoa Bowl", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbfifmiw06vdRHbH4qDuxWNu4n4LQehBi_ip6E0sgukGtwxYgJwQMcC_pLmWUIhRIhbYq0LxTNS3BfnpXANgqLq2x_tJu3J7DBnYtQ9pzPKaVHk_BQQzLsiQrhQPN0mh_piYMWLtp1GIs3hE1pOo5NaUHq3U7YRGV6Lzsj7tp6gQ8Xdyh2nn2L5-0RyZ7ns6CmYL_JyuXFBpnMEmbiVmcnewYOAChNpomhhhjobQ4ebt0pEHh3TNXkg7l8RDGiM3L0Svmf2Vdmn64t" },
    { id: 3, title: "Atlantic Salmon with Asparagus", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkG_ulfIORH3kAtAzVAAodT-0AA8GNrpR8RE2qQD_6IMFRDhDwQnnx8RqAOUQMZ3JXkhodkhH5YELyBg9gIWxWQlVlKtcCE9QYXMc2bqWxIpU_rUq8tMo5aYUZdfdvAREHOsV1dxDwPCGvW_zXHFiNDeQTcPtIUgqMTB4j65XDvYr-llF-bNQFMhpK3j-IPdQX3-kudXOqwCgsB-SBDUwz_gTlBuKiklCMoDWX5KWjAAayP4OYJqnZOm_gAvmHcAJKl6rCSSYJURuZ" },
    { id: 4, title: "Spicy Red Curry Chicken", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDemof1yr3U3-Hw7v6VmQm2Pay753tLYpFPKb-TW38Nq1j38lhf25IrRYWLxVPJb7cZvWFQqkevh1sD7N2I7nSKJo1xbvN8mGyoJEVpLtAxBAYw0VHad9HQlRaO9KdnLr0Lh8uo8tja_xizmpPutfFhrHDCq4e2uzNQhvj27kNK3BAU54BtTKZlesW3VIQmfPaJxN3vWU7JkOBJvrcPeto7oum86V3GKfFqDhgmFoRKqQgUbzYuYH6dKD9rL_E669uFIZ6cYpwEeLxm" },
  ];

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="text-center mb-16 space-y-4">
        <h1 className="font-serif text-5xl md:text-6xl font-bold italic tracking-tight text-on-surface">Curated Recipe Gallery</h1>
        <p className="font-sans text-lg text-secondary max-w-2xl mx-auto">Discover AI-generated culinary creations perfectly matched to your preferences and pantry combinations.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {recipes.map(recipe => (
          <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all block border border-outline-variant/10 cursor-pointer">
            <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent flex items-end p-6">
              <h3 className="font-serif text-xl font-bold text-on-surface leading-tight text-shadow-sm group-hover:text-primary transition-colors">{recipe.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
