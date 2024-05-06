import type { FilterType, MediaData } from '@/types/media';
import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateClient } from '@/modules/supabase';

interface MediaApiRequest extends NextApiRequest {
  body: {
    filter: FilterType;
    page: [number, number];
    type?: string;
  };
}

/**
 * /api/media api get요청을 받는 코드
 */
export default async function Media(
  req: MediaApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const supabase = CreateClient();

    console.log(req.body);

    const { data: count } = await supabase
      .schema('todaywantlook')
      .rpc('get_count', {
        _title: req.body.filter.title.join(''),
        _genre: req.body.filter.genre.join(''),
        _type: req.body.filter.type.join(''),
        _update: req.body.filter.updateDays.join(''),
      });

    let result = (
      await supabase
        .schema('todaywantlook')
        .rpc('get_medias', {
          _title: req.body.filter.title.join(''),
          _genre: req.body.filter.genre.join(''),
          _type: req.body.filter.type.join(''),
          _update: req.body.filter.updateDays.join(''),
        })
        .range(req.body.page[0], req.body.page[1] - 1)
    ).data;

    if (result) {
      return res.status(200).send({
        mediaData: result,
        mediaCount: count,
      });
    }
  } else {
    res.status(400).send('Post Request Only');
  }
}
