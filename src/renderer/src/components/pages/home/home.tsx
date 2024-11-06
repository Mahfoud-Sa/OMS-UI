import { Button } from '@renderer/components/ui/button'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const Home = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  return (
    <div>
      <Button onClick={() => reactToPrintFn()}>Print</Button>
      {/* min-w-[210mm] min-h-[297mm] for A4 Page */}
      <div className="min-w-[210mm] min-h-[297mm]" dir="rtl" ref={contentRef}>
        <div className=" print-header"></div>
        <p className="print-body">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam animi dolore nemo quia
          pariatur harum tempore reiciendis molestiae quaerat dignissimos numquam veniam, ullam
          expedita sequi iusto excepturi consequuntur eveniet minima facere modi, distinctio unde
          recusandae delectus? Maxime minus facilis quas id quisquam dignissimos a corporis error
          consectetur vero. Necessitatibus, maxime dolores. Temporibus quas aspernatur eum quisquam
          maiores omnis earum at iusto blanditiis fuga necessitatibus ratione rem sit provident
          molestias illo cupiditate reiciendis eos, praesentium corporis sunt ipsum doloribus
          voluptate delectus! Sit ex praesentium sunt tempore, nulla delectus officiis placeat
          laborum, quasi maiores enim repellat iure similique, reprehenderit hic ullam voluptatibus
          earum. Iusto a eos quae, rerum, cupiditate rem deserunt ipsa adipisci aliquid placeat
          velit atque, vitae quam fuga sit dolorem iste ducimus? Ipsam, atque alias! Ut quam amet
          ratione mollitia officiis iste blanditiis voluptatibus? Odio repellendus placeat
          repudiandae ad odit culpa dolorum neque, possimus eligendi, quam voluptatum tempore
          molestiae laudantium exercitationem, hic expedita. Quis eos necessitatibus fuga. Fugit
          laborum ipsum consequuntur impedit atque. Ex in ut eveniet enim illum. Deserunt ipsa
          veritatis perferendis praesentium odio saepe cupiditate maiores explicabo illum amet odit
          officia molestias architecto, reprehenderit animi exercitationem! Ratione impedit delectus
          dolor nihil nobis commodi ab repudiandae maiores, blanditiis excepturi repellendus
          reiciendis soluta dignissimos sequi, doloribus quaerat numquam voluptatibus necessitatibus
          maxime. Soluta nam error ex, praesentium quis voluptas fuga ullam nesciunt? Rem
          perferendis rerum deleniti est molestiae officiis iure id asperiores aperiam totam. Amet
          voluptas vel deserunt consectetur! Voluptatum vero, ea natus hic illo ipsum labore itaque
          aperiam ipsam quos magnam? Deleniti hic nostrum recusandae! Voluptatibus fugiat, qui
          commodi quod facilis nesciunt magni quae itaque praesentium. Aperiam delectus mollitia
          earum quisquam ab similique corporis error, eligendi beatae facilis id! Amet voluptatibus
          quos consequuntur qui, reiciendis, ipsum eaque mollitia blanditiis culpa dolor cupiditate
          est molestiae, nihil laborum at animi odit repudiandae natus ab necessitatibus pariatur
          eum id corrupti. Reprehenderit, reiciendis at odio deleniti, fugiat ab in maiores
          perferendis hic nihil pariatur illo porro, dolor possimus necessitatibus ullam quisquam
          quibusdam ipsum dignissimos consectetur velit doloribus. Fuga animi vel in aliquam
          asperiores, nemo quis ut at quod, hic dolor ex temporibus aliquid necessitatibus alias
          aspernatur molestias earum vero eos. Illo, ipsam ea accusantium debitis repudiandae
          deleniti dolores temporibus nobis necessitatibus placeat fugiat nisi praesentium ipsum,
          cupiditate, voluptatum nostrum non hic? Vitae, corporis et itaque minus ad, enim dolores
          odio officiis quod libero quo sapiente nostrum est repellendus quas in consectetur ratione
          at aperiam molestias esse beatae pariatur aliquid? Obcaecati, porro pariatur? Harum
          tempore debitis iusto fugit cum maiores accusantium soluta aliquid eum dolorem, veniam
          consequatur labore ducimus. Est unde, ut necessitatibus maxime laborum vel error suscipit
          similique facilis cumque repellat, qui deserunt repudiandae consectetur ipsam deleniti ad,
          ipsa cum. Doloribus saepe, minus reiciendis ut autem ducimus. Minus possimus maxime velit
          alias, iure eaque repellat quia! Labore natus in obcaecati molestias magnam fugiat cum est
          sint ullam eveniet odio asperiores amet, quos hic maxime dolores earum deleniti maiores
          rem necessitatibus provident cupiditate blanditiis. Quibusdam inventore nihil est ad, amet
          cum id, quaerat consequatur a expedita nemo incidunt saepe recusandae impedit rem
          explicabo corrupti animi? Aspernatur ducimus quasi excepturi illo cumque. Dolores cum
          eveniet possimus corrupti maxime cupiditate obcaecati eligendi provident quas voluptate,
          illo labore consequuntur ducimus atque similique molestias consectetur suscipit, eum
          libero ratione quis delectus fugiat exercitationem cumque. Enim eius, odio obcaecati
          explicabo pariatur labore consequuntur cupiditate magnam in laboriosam, facere, possimus
          nihil molestiae laborum aliquam. Nemo tenetur neque debitis voluptatibus labore quaerat
          cumque similique commodi modi perspiciatis doloremque voluptas exercitationem illo quas
          quam, soluta obcaecati eaque dolorem? Quibusdam voluptatibus recusandae adipisci
          voluptates, placeat velit nesciunt asperiores facere eveniet incidunt tempore eos debitis
          a quo laboriosam earum laudantium minima, architecto dolores nisi commodi blanditiis
          neque, totam alias? Nobis optio doloremque velit veritatis cum ad repellendus cupiditate,
          voluptate obcaecati beatae rem itaque laboriosam, qui atque ducimus eos ullam? Labore
          inventore alias expedita ipsam veritatis suscipit qui dolore, autem debitis officia velit
          ea temporibus odit voluptatum sapiente voluptates fugit dolor rerum. Cumque vitae nihil
          omnis mollitia qui tenetur? Culpa, dicta fuga. At molestias magnam exercitationem modi
          earum? Autem numquam, impedit mollitia ullam fugit aut aperiam error tempora, facere magni
          iure alias natus temporibus sed sapiente rem aliquam itaque magnam. Quos ipsum temporibus
          iusto voluptas aliquid architecto quaerat odit quae, doloremque alias similique numquam
          nihil, cum unde nemo nesciunt reprehenderit a veniam iure. Enim voluptas magnam, ipsa
          ratione est quae fugiat et sunt cumque modi autem! Quasi fuga est reprehenderit qui,
          repellat veritatis! Temporibus quisquam amet, non similique tempore mollitia, ipsam itaque
          eaque ex maxime nesciunt recusandae quis nemo natus repudiandae, at error ipsum?
          Temporibus, quae deserunt blanditiis ratione sequi quas at optio a amet natus cupiditate
          quos non error expedita quia mollitia vel nemo. Id asperiores repudiandae consequatur
          eius, sequi quibusdam consequuntur illo perspiciatis recusandae ducimus temporibus
          doloribus explicabo qui labore rerum quam quidem, a fugit. Tempore amet quas, ex omnis vel
          atque deleniti delectus inventore ducimus magnam asperiores? Ipsa, laboriosam, eos natus
          quos dignissimos, expedita doloremque voluptates molestiae ab sint eius asperiores commodi
          delectus eaque culpa quo error? Dolores fuga maiores laboriosam quia eius a quis inventore
          voluptatum amet libero quo tempore facere, corporis, magni iusto necessitatibus eveniet?
          At saepe consectetur ad corporis atque nam magni! Aliquid repellendus debitis enim
          architecto a ipsum vitae earum quos placeat. Ullam, distinctio. Recusandae voluptas error
          cupiditate odit illum voluptates, impedit dolores accusantium quasi neque saepe eius quam
          nihil, repudiandae inventore, vitae alias fuga. Deleniti qui aliquam neque nihil ullam
          eaque consequuntur dolores, soluta voluptates quibusdam labore omnis, blanditiis molestias
          laborum voluptas sit doloremque ratione asperiores. Quo ratione ex quos, tempore ipsa quae
          sed nesciunt voluptatem dolorum nulla? Atque iusto minus facere aperiam sit numquam
          corrupti? Voluptate numquam sit maxime earum consequuntur? Molestiae eveniet dolorum
          veritatis alias ad sint hic quia. Quo nisi, impedit et, nihil voluptatem provident sit
          aperiam dicta qui praesentium reiciendis tempore, eum assumenda vitae autem cumque?
          Consectetur similique inventore reprehenderit perferendis quia ullam aut vero eligendi,
          esse sequi deserunt harum velit quibusdam laboriosam sed, aperiam soluta, autem ducimus?
          Delectus eaque molestiae ipsum sapiente blanditiis nam assumenda consectetur corrupti qui!
          Assumenda, doloremque beatae magni ab omnis corporis ipsam blanditiis autem porro delectus
          cum impedit, voluptatum consequuntur unde. Ipsam nulla sequi vero maxime eius! Laborum
          error placeat nihil aut earum, assumenda quas voluptates eius voluptatum tempore, ullam
          inventore magnam itaque quaerat quia sed voluptatibus? Labore possimus aut modi, id quis
          perferendis, explicabo est natus laudantium quam beatae. Qui tempora quae libero fuga,
          mollitia quaerat beatae! Modi dignissimos nostrum, quisquam dolorum, a cumque fugiat,
          voluptates dolores veritatis nobis consectetur consequuntur temporibus facilis maiores. Ab
          expedita assumenda aperiam minus asperiores eveniet repellat ipsa. Eligendi ea, optio rem
          excepturi vel quis illum sed recusandae minima quos voluptatibus expedita, veniam enim?
          Optio nulla, aspernatur nesciunt aut eligendi assumenda placeat odit voluptate iure
          architecto, repellat, reiciendis ea iusto perferendis quis consectetur repellendus
          voluptas in quam magni consequuntur. Labore perferendis ducimus, recusandae iusto
          temporibus nam itaque alias cupiditate voluptatibus in atque suscipit vitae ex qui
          consequatur, aperiam ipsum sed voluptates officiis et iure ab ratione perspiciatis rem.
          Numquam debitis ducimus, praesentium veniam dolore aliquam recusandae hic odio repellendus
          animi reiciendis est ab quos consectetur officia! Maxime voluptatum blanditiis facilis
          explicabo dolor quis voluptates iste! Velit neque doloribus autem molestias reprehenderit,
          blanditiis error consequatur magnam nisi voluptatum non nihil, accusantium dolores unde.
          Autem at natus id vitae temporibus culpa nam. Commodi, praesentium nam perspiciatis, qui
          voluptates ut deleniti ea architecto delectus eligendi deserunt placeat quia error
          expedita. Reiciendis vero impedit aliquam nam atque odio voluptas alias quidem iusto
          itaque eos assumenda ipsa ipsum, dolores fugiat voluptate quam nemo repudiandae beatae
          perspiciatis ipsam? Sit, quasi delectus obcaecati labore minus at consequuntur
          perspiciatis ut dignissimos quas fugit aut rem in! Sit cupiditate tempora corrupti
          voluptatem nisi doloribus architecto ullam quo minus autem. Culpa nisi, ducimus possimus
          maxime minus vero, laborum exercitationem explicabo voluptatem dicta sint. Doloribus dicta
          incidunt cum placeat ullam inventore deleniti modi, quasi ipsa officia voluptatem qui
          eaque, perspiciatis quod quia et? Laboriosam accusantium quidem perspiciatis officiis
          labore, ipsum in maiores cupiditate quasi, doloremque earum velit architecto error
          dignissimos alias! Dolorum, dolore cumque, hic repudiandae inventore laborum magnam
          veniam, fugiat soluta iure reiciendis dolorem nemo. Officia quae, fugit deleniti quo
          perspiciatis porro consectetur? Magni, laudantium illo eius porro excepturi est earum
          possimus id facere, quos, atque laborum libero ipsum unde distinctio mollitia fugiat nihil
          voluptatibus cupiditate ut? Praesentium eligendi asperiores perferendis quas beatae ut, ex
          eaque ducimus voluptatum dolor excepturi, earum a quibusdam velit rem repellat! Tenetur
          nulla voluptatem corporis, temporibus libero tempora sequi suscipit ratione eveniet sed ut
          aut laborum quaerat, illum nemo doloribus delectus architecto molestiae exercitationem.
          Soluta, corporis laboriosam doloribus cumque placeat maiores fuga ea ratione sint impedit
          hic obcaecati voluptatum exercitationem iste qui, consequatur adipisci quod a itaque, sit
          dolore consectetur? Tempore, placeat possimus aliquam eum pariatur dolor obcaecati fuga
          doloribus culpa soluta impedit ullam nobis dignissimos ipsum consectetur quisquam
          provident atque facere sequi corrupti nesciunt corporis? Ullam quia quod magnam doloribus
          similique minus illo reiciendis impedit, tenetur beatae praesentium mollitia numquam
          aliquid dolorum perspiciatis aut modi culpa veniam officiis soluta, repellendus eligendi.
          Porro deserunt illum adipisci excepturi, accusantium quisquam ipsa iure laborum, placeat a
          alias, vel obcaecati ratione maiores cupiditate corporis explicabo cumque praesentium
          beatae nisi facilis consequatur non! Omnis suscipit in similique. Molestias eius aut
          aliquam esse maiores enim suscipit vitae, dicta nobis, ipsam sunt sequi dignissimos autem
          necessitatibus? Similique sit aspernatur et accusamus a ullam, eaque excepturi doloribus
          debitis fuga ipsa. Ipsam porro nostrum aliquam sit velit, atque necessitatibus,
          reprehenderit, voluptas vitae architecto quasi? Suscipit pariatur perferendis eligendi,
          tenetur magnam vel harum atque maiores explicabo iste facere non perspiciatis. Quis
          suscipit eos rerum rem ullam tempora sapiente pariatur maiores quaerat sequi autem tempore
          earum, quod id voluptatibus modi doloremque veniam beatae, ad alias iure fugit aut eaque!
          Mollitia explicabo tempore quas accusamus inventore pariatur dolorem cum, alias vero
          tenetur incidunt laborum sit itaque voluptatibus? Accusamus, nulla officia hic eligendi
          culpa, tempora praesentium molestiae natus placeat temporibus ipsa est libero quaerat
          magnam, tempore doloribus? Iure nulla ab ipsam eveniet consequuntur, voluptatem,
          blanditiis ipsum animi placeat dolore sit asperiores deserunt consequatur laborum non
          provident quae illum eligendi veritatis vero. Quo molestias et sapiente nisi autem, ipsa
          nobis quis in? Ratione nulla sapiente temporibus eaque quos, ullam, obcaecati repellat in
          magni dolor odit, quibusdam quidem animi repudiandae ipsam soluta ducimus quia accusamus
          omnis. Molestias non enim et ab, ducimus doloremque ullam impedit maxime amet sunt quia
          aliquam provident magni atque inventore dolor iure tempore quasi aperiam vitae harum
          voluptas! Autem ducimus dolores cumque, delectus recusandae soluta est molestias,
          accusamus, harum quis ipsum eos quod. Corrupti itaque dolores sit molestiae et aperiam
          labore. Nam exercitationem quis incidunt, consectetur assumenda quo dolorem inventore
          ducimus sapiente sed fugit soluta adipisci provident qui veritatis excepturi totam non. Et
          quibusdam numquam excepturi vitae natus odio illo neque vero! Eligendi officiis dolorum
          quasi, est nobis aut magnam magni unde ab ea voluptatem commodi non recusandae pariatur
          distinctio cumque quis tenetur ad in odit expedita. Necessitatibus debitis quos voluptate
          at iure, tenetur dignissimos aspernatur repellendus, aliquam nostrum nam eius. Facere
          laborum ab vel quae expedita, necessitatibus magni eligendi accusantium iusto temporibus
          ipsa animi est voluptatem quam. Vero labore quos, nemo nulla, magnam totam ex deserunt
          ratione, eum porro error velit quidem est tempore illum dignissimos. Hic, facilis
          veritatis eos a, eius officia incidunt, dolorem consequuntur rem quas similique deleniti
          provident molestias pariatur totam ad! Beatae hic in quisquam ab? Obcaecati quibusdam
          architecto eaque quasi asperiores hic nihil ab ex explicabo fugit nulla, quos totam
          consequuntur maiores magnam sit fuga in voluptatum officia quidem, aperiam deleniti iste?
          Rerum quod optio facere illo iste ea eveniet voluptate soluta sequi natus nihil, numquam
          recusandae pariatur similique corporis excepturi amet placeat quam incidunt voluptas
          inventore obcaecati perferendis! Alias minima ullam quod aspernatur et! Ipsum eius
          distinctio, perspiciatis numquam nisi quod molestiae dolor eligendi facere porro esse
          cumque, voluptas nemo quaerat obcaecati voluptates sunt dolores nihil ratione in maiores
          quas ullam dolorem. Molestiae veniam eius at enim, sunt unde deleniti, fugit ipsam
          reprehenderit est sequi. Fuga earum veritatis rerum totam doloremque?
        </p>
        <div className=" print-footer"></div>
      </div>
    </div>
  )
}

export default Home
