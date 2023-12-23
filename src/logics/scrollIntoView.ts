export function scrollIntoView(id: string){
    const element: HTMLElement | null = document.getElementById(id)
    element?.scrollIntoView({
        block: "center",
        behavior: "smooth"
    })
}