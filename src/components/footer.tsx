/** footer for credits */
export default function Footer() {
    return <div className="mt-5 bg-slate-300">
        <div className="footer py-4 flex flex-col gap-3 justify-center items-center container mx-auto">
            <p>Demo by Cristóbal Díaz Álvarez</p>

            <a href="https://www.linkedin.com/in/cristobal-diaz-alvarez/" target="_blank" rel="nofollow" className="footer__link">LinkedIn</a>
            <a href="https://github.com/drtobal" target="_blank" rel="nofollow" className="footer__link">Github</a>
            <a href="https://stackoverflow.com/users/7827198" target="_blank" rel="nofollow" className="footer__link">Stack Overflow</a>
        </div>
    </div>;
}
